"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Code, 
  Copy, 
  Check, 
  Play, 
  BookOpen, 
  Zap, 
  MessageSquare, 
  Brain,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Terminal,
  FileText,
  Settings,
  Key,
  Cpu,
  Globe,
  Lightbulb,
  Shield
} from "lucide-react"
import Link from "next/link"

export default function ApiDocsPage() {
  const [activeTab, setActiveTab] = useState("openai")
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const CodeBlock = ({ code, language, id }: { code: string; language: string; id: string }) => (
    <div className="relative bg-gray-900 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <Badge variant="secondary" className="text-xs">{language}</Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(code, id)}
          className="h-6 px-2 text-gray-400 hover:text-white"
        >
          {copiedCode === id ? (
            <Check className="h-3 w-3" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      </div>
      <pre className="text-gray-100 text-sm overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <Code className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">API Documentation</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive guides and examples for integrating OpenAI, Claude, and Perplexity APIs into your applications
            </p>
            <div className="mt-6 flex items-center justify-center space-x-4">
              <Badge variant="outline" className="px-3 py-1">
                <Zap className="h-3 w-3 mr-1" />
                Real-time Examples
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                <BookOpen className="h-3 w-3 mr-1" />
                Interactive Guides
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                <Terminal className="h-3 w-3 mr-1" />
                Code Samples
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="openai" className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4" />
              <span>OpenAI</span>
            </TabsTrigger>
            <TabsTrigger value="claude" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>Claude</span>
            </TabsTrigger>
            <TabsTrigger value="perplexity" className="flex items-center space-x-2">
              <Lightbulb className="h-4 w-4" />
              <span>Perplexity</span>
            </TabsTrigger>
          </TabsList>

          {/* OpenAI Documentation */}
          <TabsContent value="openai" className="space-y-8">
            {/* Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">OpenAI API</CardTitle>
                    <CardDescription>
                      Powerful language models for text generation, chat, and more
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <h3 className="font-semibold">Chat Completions</h3>
                    <p className="text-sm text-gray-600">Interactive conversations with GPT models</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <h3 className="font-semibold">Text Generation</h3>
                    <p className="text-sm text-gray-600">Create content, summaries, and translations</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Cpu className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <h3 className="font-semibold">Fine-tuning</h3>
                    <p className="text-sm text-gray-600">Customize models for specific tasks</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Start */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Quick Start</CardTitle>
                <CardDescription>
                  Get started with OpenAI API in minutes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>1. Install the OpenAI package</Label>
                  <CodeBlock
                    code={`npm install openai`}
                    language="bash"
                    id="openai-install"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>2. Set up your API key</Label>
                  <CodeBlock
                    code={`import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});`}
                    language="javascript"
                    id="openai-setup"
                  />
                </div>

                <div className="space-y-2">
                  <Label>3. Make your first API call</Label>
                  <CodeBlock
                    code={`const completion = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [
    { role: "user", content: "Hello! How are you today?" }
  ],
});

console.log(completion.choices[0].message.content);`}
                    language="javascript"
                    id="openai-first-call"
                  />
                </div>
              </CardContent>
            </Card>

            {/* API Reference */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">API Reference</CardTitle>
                <CardDescription>
                  Complete API endpoints and parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Chat Completions</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="default">POST</Badge>
                      <code className="text-sm font-mono">/v1/chat/completions</code>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Creates a chat completion for the provided messages.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">Required</Badge>
                        <span className="text-sm font-mono">model</span>
                        <span className="text-sm text-gray-600">- The model to use for completion</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">Required</Badge>
                        <span className="text-sm font-mono">messages</span>
                        <span className="text-sm text-gray-600">- Array of message objects</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Models</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">GPT-4</h4>
                      <p className="text-sm text-gray-600 mb-2">Most capable model, best for complex tasks</p>
                      <Badge variant="secondary">gpt-4</Badge>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">GPT-3.5 Turbo</h4>
                      <p className="text-sm text-gray-600 mb-2">Fast and efficient, great for most use cases</p>
                      <Badge variant="secondary">gpt-3.5-turbo</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Examples */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Examples</CardTitle>
                <CardDescription>
                  Common use cases and code examples
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Text Summarization</h3>
                  <CodeBlock
                    code={`const summary = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [
    {
      role: "system",
      content: "You are a helpful assistant that summarizes text."
    },
    {
      role: "user",
      content: "Please summarize this article: [Your article text here]"
    }
  ],
  max_tokens: 150,
  temperature: 0.3
});`}
                    language="javascript"
                    id="openai-summary"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Code Generation</h3>
                  <CodeBlock
                    code={`const code = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    {
      role: "system",
      content: "You are a helpful programming assistant. Generate clean, efficient code."
    },
    {
      role: "user",
      content: "Write a function to sort an array of objects by a specific property"
    }
  ],
  temperature: 0.1
});`}
                    language="javascript"
                    id="openai-code"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Claude Documentation */}
          <TabsContent value="claude" className="space-y-8">
            {/* Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Claude API</CardTitle>
                    <CardDescription>
                      Anthropic&apos;s advanced AI assistant for safe and helpful interactions
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                    <h3 className="font-semibold">Conversational AI</h3>
                    <p className="text-sm text-gray-600">Natural, helpful conversations</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                    <h3 className="font-semibold">Content Analysis</h3>
                    <p className="text-sm text-gray-600">Deep understanding of text</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Shield className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                    <h3 className="font-semibold">Safety First</h3>
                    <p className="text-sm text-gray-600">Built with safety in mind</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Start */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Quick Start</CardTitle>
                <CardDescription>
                  Get started with Claude API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>1. Install the Anthropic package</Label>
                  <CodeBlock
                    code={`npm install @anthropic-ai/sdk`}
                    language="bash"
                    id="claude-install"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>2. Set up your API key</Label>
                  <CodeBlock
                    code={`import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});`}
                    language="javascript"
                    id="claude-setup"
                  />
                </div>

                <div className="space-y-2">
                  <Label>3. Make your first API call</Label>
                  <CodeBlock
                    code={`const message = await anthropic.messages.create({
  model: "claude-3-sonnet-20240229",
  max_tokens: 1024,
  messages: [
    { role: "user", content: "Hello! How are you today?" }
  ],
});

console.log(message.content[0].text);`}
                    language="javascript"
                    id="claude-first-call"
                  />
                </div>
              </CardContent>
            </Card>

            {/* API Reference */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">API Reference</CardTitle>
                <CardDescription>
                  Complete API endpoints and parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Messages</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="default">POST</Badge>
                      <code className="text-sm font-mono">/v1/messages</code>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Creates a message using Claude.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">Required</Badge>
                        <span className="text-sm font-mono">model</span>
                        <span className="text-sm text-gray-600">- The Claude model to use</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">Required</Badge>
                        <span className="text-sm font-mono">messages</span>
                        <span className="text-sm text-gray-600">- Array of message objects</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Models</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Claude 3 Opus</h4>
                      <p className="text-sm text-gray-600 mb-2">Most capable model for complex tasks</p>
                      <Badge variant="secondary">claude-3-opus-20240229</Badge>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Claude 3 Sonnet</h4>
                      <p className="text-sm text-gray-600 mb-2">Balanced performance and speed</p>
                      <Badge variant="secondary">claude-3-sonnet-20240229</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Perplexity Documentation */}
          <TabsContent value="perplexity" className="space-y-8">
            {/* Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Lightbulb className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Perplexity API</CardTitle>
                    <CardDescription>
                      Real-time search and AI-powered answers with web knowledge
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <Globe className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <h3 className="font-semibold">Web Search</h3>
                    <p className="text-sm text-gray-600">Real-time information from the web</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <h3 className="font-semibold">AI Answers</h3>
                    <p className="text-sm text-gray-600">Intelligent responses with citations</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Zap className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <h3 className="font-semibold">Fast & Accurate</h3>
                    <p className="text-sm text-gray-600">Quick responses with up-to-date info</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Start */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Quick Start</CardTitle>
                <CardDescription>
                  Get started with Perplexity API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>1. Install the Perplexity package</Label>
                  <CodeBlock
                    code={`npm install perplexity`}
                    language="bash"
                    id="perplexity-install"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>2. Set up your API key</Label>
                  <CodeBlock
                    code={`import Perplexity from 'perplexity';

const perplexity = new Perplexity({
  apiKey: process.env.PERPLEXITY_API_KEY,
});`}
                    language="javascript"
                    id="perplexity-setup"
                  />
                </div>

                <div className="space-y-2">
                  <Label>3. Make your first API call</Label>
                  <CodeBlock
                    code={`const response = await perplexity.chat({
  model: "llama-3.1-sonar-small-128k-online",
  messages: [
    { role: "user", content: "What's the latest news about AI?" }
  ],
  search_domain: "news",
  include_citations: true
});

console.log(response.choices[0].message.content);`}
                    language="javascript"
                    id="perplexity-first-call"
                  />
                </div>
              </CardContent>
            </Card>

            {/* API Reference */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">API Reference</CardTitle>
                <CardDescription>
                  Complete API endpoints and parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Chat</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="default">POST</Badge>
                      <code className="text-sm font-mono">/v1/chat/completions</code>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Creates a chat completion with web search capabilities.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">Required</Badge>
                        <span className="text-sm font-mono">model</span>
                        <span className="text-sm text-gray-600">- The Perplexity model to use</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">Required</Badge>
                        <span className="text-sm font-mono">messages</span>
                        <span className="text-sm text-gray-600">- Array of message objects</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Models</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Sonar Large</h4>
                      <p className="text-sm text-gray-600 mb-2">Most capable model with web search</p>
                      <Badge variant="secondary">llama-3.1-sonar-large-128k-online</Badge>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Sonar Small</h4>
                      <p className="text-sm text-gray-600 mb-2">Fast and efficient for most tasks</p>
                      <Badge variant="secondary">llama-3.1-sonar-small-128k-online</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>


      </div>
    </div>
  )
}
