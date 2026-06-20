import { useState, useRef } from "react";
import { Camera, Upload } from "lucide-react";
import { useGetProfile, useUpdateProfile, useChangePassword } from "@workspace/api-client-react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { getGetProfileQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export default function Profile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: profile, isLoading } = useGetProfile();
  const updateMutation = useUpdateProfile();
  const changePwdMutation = useChangePassword();

  const p = profile as any;
  const [form, setForm] = useState({ fullName: "", mobile: "", address: "", preferredLanguage: "en" });
  const [pwdForm, setPwdForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [initialized, setInitialized] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  if (p && !initialized) {
    setForm({
      fullName: p.fullName || "",
      mobile: p.mobile || "",
      address: p.address || "",
      preferredLanguage: p.preferredLanguage || "en",
    });
    setPreviewPhoto(p.profilePhoto || null);
    setInitialized(true);
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Please select an image file", variant: "destructive" });
      return;
    }
    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", "profile-photo");
      const token = localStorage.getItem("auth_token");
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      const photoUrl = `/uploads/${data.filename || data.path?.split("/").pop()}`;
      updateMutation.mutate(
        { data: { profilePhoto: photoUrl } },
        {
          onSuccess: () => {
            setPreviewPhoto(photoUrl);
            queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey() });
            toast({ title: "Profile photo updated" });
          },
        }
      );
    } catch {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        setPreviewPhoto(dataUrl);
        updateMutation.mutate(
          { data: { profilePhoto: dataUrl } },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey() });
              toast({ title: "Profile photo updated" });
            },
          }
        );
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(
      { data: { fullName: form.fullName, mobile: form.mobile, address: form.address, preferredLanguage: form.preferredLanguage } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey() });
          toast({ title: "Profile updated" });
        },
        onError: () => toast({ title: "Error saving profile", variant: "destructive" }),
      }
    );
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirm) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    changePwdMutation.mutate(
      { data: { currentPassword: pwdForm.currentPassword, newPassword: pwdForm.newPassword } },
      {
        onSuccess: () => {
          setPwdForm({ currentPassword: "", newPassword: "", confirm: "" });
          toast({ title: "Password changed successfully" });
        },
        onError: (err: any) => toast({ title: err?.data?.error || "Error changing password", variant: "destructive" }),
      }
    );
  };

  if (isLoading) return <AppLayout><Skeleton className="h-64" /></AppLayout>;

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
        </div>

        {/* Profile Photo */}
        <Card className="border-border">
          <CardHeader><CardTitle className="text-base">Profile Photo</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={previewPhoto || ""} alt={p?.fullName} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                    {p?.fullName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
              <div>
                <p className="font-medium text-foreground">{p?.fullName}</p>
                <p className="text-sm text-muted-foreground">{p?.email}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                >
                  <Upload className="h-3.5 w-3.5 mr-1.5" />
                  {uploadingPhoto ? "Uploading..." : "Change Photo"}
                </Button>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max 5MB.</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handlePhotoUpload}
              />
            </div>
          </CardContent>
        </Card>

        {/* Personal Info */}
        <Card className="border-border">
          <CardHeader><CardTitle className="text-base">Personal Information</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Mobile Number</Label>
                  <Input value={form.mobile} onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input value={p?.email || ""} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Preferred Language</Label>
                <select
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                  value={form.preferredLanguage}
                  onChange={e => setForm(f => ({ ...f, preferredLanguage: e.target.value }))}
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="bn">বাংলা (Bengali)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="mr">मराठी (Marathi)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="gu">ગુજરાતી (Gujarati)</option>
                  <option value="kn">ಕನ್ನಡ (Kannada)</option>
                  <option value="ml">മലയാളം (Malayalam)</option>
                  <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                </select>
              </div>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card className="border-border">
          <CardHeader><CardTitle className="text-base">Change Password</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" value={pwdForm.currentPassword} onChange={e => setPwdForm(f => ({ ...f, currentPassword: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" value={pwdForm.newPassword} onChange={e => setPwdForm(f => ({ ...f, newPassword: e.target.value }))} minLength={8} />
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input type="password" value={pwdForm.confirm} onChange={e => setPwdForm(f => ({ ...f, confirm: e.target.value }))} />
              </div>
              <Button type="submit" disabled={changePwdMutation.isPending}>
                {changePwdMutation.isPending ? "Changing..." : "Change Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
