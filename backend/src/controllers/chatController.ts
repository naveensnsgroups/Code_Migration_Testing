import { Request, Response } from 'express';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages';
import Employee from '../models/Employee.js';

export const handleChat = async (req: Request, res: Response) => {
  try {
    console.log('🤖 Chat request received:', { message: req.body.message, historyLength: req.body.history?.length || 0 });
    
    const { message, history } = req.body;

    // Validate message
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      console.log('❌ Invalid message');
      return res.status(400).json({ error: 'Message is required and must be a non-empty string' });
    }

    // Check API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.log('❌ Gemini API key not found in environment');
      return res.status(500).json({ error: 'Gemini API key is not configured on the server' });
    }

    console.log('✅ API key found, initializing LangChain...');

    // Fetch employee records from MongoDB for context
    let employeeContext = '';
    try {
      const employees = await Employee.find({}).lean();
      console.log(`📦 Found ${employees?.length || 0} employee records in MongoDB`);
      
      if (employees && employees.length > 0) {
        employeeContext = employees.map((e: any, index: number) => 
          `${index + 1}. **${e.fullName}** — ID: \`${e.employeeId}\` | Department: **${e.department || 'N/A'}** | Position: *${e.position || 'N/A'}* | Email: \`${e.email || 'N/A'}\` | Phone: \`${e.phone || 'N/A'}\` | Join Date: *${e.joinDate ? new Date(e.joinDate).toISOString().split('T')[0] : 'N/A'}*`
        ).join('\n');
      } else {
        employeeContext = 'No employees found in database.';
      }
    } catch (dbError) {
      console.error('⚠️ Error fetching employees:', dbError);
      employeeContext = '(Could not fetch employee records)';
    }

    // Initialize ChatGoogleGenerativeAI
    console.log('🚀 Initializing ChatGoogleGenerativeAI with gemini-3.5-flash-lite...');
    
    const model = new ChatGoogleGenerativeAI({
      model: 'gemini-3.5-flash-lite',
      apiKey: apiKey,
      temperature: 0.1,
      maxRetries: 2,
    });

    // Build messages for LangChain
    const messages: any[] = [
      new SystemMessage(
        `You are the official AI assistant for the Enterprise HR Personal Details Management System.

Here is the complete and exact list of employee records currently registered in the database:
${employeeContext}

CRITICAL INSTRUCTION:
When the user asks for employees or who is in our system, do NOT summarize or shorten the list. You MUST output the exact formatted list provided to you above verbatim, including every single detail (Name, ID, Department, Position, Email, Phone, and Join Date).`
      ),
    ];

    // Add conversation history
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        if (msg.role === 'user') {
          messages.push(new HumanMessage(msg.content));
        } else if (msg.role === 'assistant') {
          messages.push(new AIMessage(msg.content));
        }
      }
    }

    // Add current user message
    messages.push(new HumanMessage(message));

    console.log(`📨 Sending ${messages.length} messages to LangChain...`);

    // Get response from LangChain
    const response = await model.invoke(messages);
    
    console.log('✅ Response received from LangChain');

    // Extract reply text
    let reply = 'I was unable to generate a response.';
    
    if (response.content) {
      if (typeof response.content === 'string') {
        reply = response.content;
      } else if (Array.isArray(response.content)) {
        reply = response.content
          .map((c: any) => typeof c === 'string' ? c : (c.text || JSON.stringify(c)))
          .join('');
      }
    }

    console.log('🎉 Chat response:', { replyLength: reply.length });

    return res.status(200).json({ 
      reply,
      success: true 
    });

  } catch (error: any) {
    console.error('❌ LangChain Chat Error:', {
      message: error.message,
      code: error.code,
      status: error.status,
      stack: error.stack?.split('\n').slice(0, 3).join('\n')
    });

    // Return specific error messages
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      return res.status(429).json({ 
        error: 'API quota exceeded. Please try again later.' 
      });
    }

    if (error.message?.includes('API key')) {
      return res.status(401).json({ 
        error: 'API key authentication failed. Check your Gemini API key.' 
      });
    }

    return res.status(500).json({ 
      error: error.message || 'Internal server error during chat' 
    });
  }
};
