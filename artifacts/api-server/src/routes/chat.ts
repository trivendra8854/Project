import { Router, type IRouter } from "express";
import { db, chatSessionsTable, chatMessagesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { CreateChatSessionBody, SendChatMessageBody } from "@workspace/api-zod";

const router: IRouter = Router();

const AI_RESPONSES = [
  "Based on Indian law, you have the right to file a complaint with the appropriate authority. Under the Consumer Protection Act 2019, you can approach the District Consumer Forum for matters up to Rs. 1 crore.",
  "The Right to Information Act 2005 gives every citizen the right to request information from public authorities. You can file an RTI application online at rtionline.gov.in.",
  "For domestic violence cases, the Protection of Women from Domestic Violence Act 2005 provides civil remedies. You can approach a Protection Officer or file a complaint with the police under Section 498A IPC.",
  "Under the Indian Constitution, you have fundamental rights including Right to Equality (Article 14), Right to Freedom (Article 19), and Right to Constitutional Remedies (Article 32).",
  "For labour disputes, you can approach the Labour Commissioner's office or file a complaint with the Industrial Tribunal under the Industrial Disputes Act 1947.",
  "Cyber crimes should be reported to the Cyber Crime Cell of your local police. You can also file complaints online at cybercrime.gov.in.",
  "For property disputes, you may need to approach the Civil Court. Ensure you have all property documents, title deeds, and any prior agreements handy.",
  "Senior citizens can seek protection under the Maintenance and Welfare of Parents and Senior Citizens Act 2007. The District Magistrate can order maintenance payments.",
];

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("consumer") || lower.includes("product") || lower.includes("refund")) {
    return AI_RESPONSES[0];
  } else if (lower.includes("rti") || lower.includes("information")) {
    return AI_RESPONSES[1];
  } else if (lower.includes("domestic") || lower.includes("violence") || lower.includes("498")) {
    return AI_RESPONSES[2];
  } else if (lower.includes("fundamental") || lower.includes("constitution") || lower.includes("rights")) {
    return AI_RESPONSES[3];
  } else if (lower.includes("labour") || lower.includes("job") || lower.includes("employment")) {
    return AI_RESPONSES[4];
  } else if (lower.includes("cyber") || lower.includes("online") || lower.includes("fraud") || lower.includes("hack")) {
    return AI_RESPONSES[5];
  } else if (lower.includes("property") || lower.includes("land") || lower.includes("house")) {
    return AI_RESPONSES[6];
  } else if (lower.includes("senior") || lower.includes("elderly") || lower.includes("parent")) {
    return AI_RESPONSES[7];
  }
  return `I understand your question about "${message}". As NyayaSetu's AI Legal Assistant, I can help you understand your legal rights and options. For specific legal advice, I recommend consulting with a qualified lawyer. Would you like me to help you find legal aid in your area?`;
}

router.get("/chat/sessions", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const sessions = await db.select().from(chatSessionsTable)
    .where(eq(chatSessionsTable.userId, user.id))
    .orderBy(desc(chatSessionsTable.updatedAt));

  const formatted = await Promise.all(sessions.map(async s => {
    const messages = await db.select().from(chatMessagesTable).where(eq(chatMessagesTable.sessionId, s.id));
    return {
      id: s.id, title: s.title,
      createdAt: s.createdAt.toISOString(), updatedAt: s.updatedAt.toISOString(),
      messageCount: messages.length,
    };
  }));

  res.json(formatted);
});

router.post("/chat/sessions", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const parsed = CreateChatSessionBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [session] = await db.insert(chatSessionsTable).values({
    userId: user.id, title: parsed.data.title,
  }).returning();

  res.status(201).json({ id: session.id, title: session.title, createdAt: session.createdAt.toISOString(), updatedAt: session.updatedAt.toISOString(), messageCount: 0 });
});

router.get("/chat/sessions/:id/messages", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);

  const [session] = await db.select().from(chatSessionsTable).where(eq(chatSessionsTable.id, id));
  if (!session || session.userId !== user.id) { res.status(404).json({ error: "Not found" }); return; }

  const messages = await db.select().from(chatMessagesTable).where(eq(chatMessagesTable.sessionId, id));
  res.json(messages.map(m => ({ id: m.id, sessionId: m.sessionId, role: m.role, content: m.content, createdAt: m.createdAt.toISOString() })));
});

router.post("/chat/sessions/:id/messages", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const parsed = SendChatMessageBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [session] = await db.select().from(chatSessionsTable).where(eq(chatSessionsTable.id, id));
  if (!session || session.userId !== user.id) { res.status(404).json({ error: "Not found" }); return; }

  await db.insert(chatMessagesTable).values({ sessionId: id, role: "user", content: parsed.data.message });

  const aiContent = getAIResponse(parsed.data.message);
  const [aiMsg] = await db.insert(chatMessagesTable).values({ sessionId: id, role: "assistant", content: aiContent }).returning();

  res.json({ id: aiMsg.id, sessionId: id, role: "assistant", content: aiContent, createdAt: aiMsg.createdAt.toISOString() });
});

export default router;
