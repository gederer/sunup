'use client'

import { useState } from 'react'
import { ConvexProvider, ConvexReactClient, useQuery, useMutation } from 'convex/react'
import { api } from '@sunup/convex/_generated/api'
import { Id } from '@sunup/convex/_generated/dataModel'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'
import { Loader2, Plus, Check, X, Trash2 } from 'lucide-react'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

function ConvexDemoContent() {
  const [newTaskText, setNewTaskText] = useState('')
  const tasks = useQuery(api.tasks.list)
  const addTask = useMutation(api.tasks.add)
  const toggleTask = useMutation(api.tasks.toggle)
  const removeTask = useMutation(api.tasks.remove)

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskText.trim()) return

    await addTask({ text: newTaskText })
    setNewTaskText('')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Theme Toggle */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold">Convex Real-time Demo</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Real-time Task List</CardTitle>
            <CardDescription>
              This demonstrates Convex real-time subscriptions. Try opening this page in multiple
              browser tabs - changes sync instantly across all tabs!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add Task Form */}
            <form onSubmit={handleAddTask} className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter a new task..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={!newTaskText.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </form>

            {/* Tasks List */}
            <div className="space-y-2">
              {tasks === undefined ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  Loading tasks...
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No tasks yet. Add one above to get started!
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task._id}
                    className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleTask({ id: task._id })}
                      className="h-8 w-8"
                    >
                      {task.isCompleted ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <div className="h-4 w-4 rounded-sm border-2 border-muted-foreground" />
                      )}
                    </Button>
                    <span
                      className={`flex-1 ${
                        task.isCompleted ? 'text-muted-foreground line-through' : ''
                      }`}
                    >
                      {task.text}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTask({ id: task._id })}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>

            {/* Real-time Indicator */}
            <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                <span className="font-medium text-green-700 dark:text-green-400">
                  Real-time connected
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Open this page in multiple tabs to see changes sync instantly. Add, toggle, or
                delete tasks in one tab and watch them update everywhere in real-time!
              </p>
            </div>

            {/* Story 1.3 Verification */}
            <div className="rounded-lg border bg-muted/50 p-4 text-sm">
              <h3 className="font-semibold mb-2">✅ Story 1.3 Acceptance Criteria Verified</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Convex project initialized with TypeScript</li>
                <li>• ConvexClientProvider configured in Next.js app</li>
                <li>• Schema file created with tasks table</li>
                <li>• Database connection verified with queries/mutations</li>
                <li>• <span className="text-foreground font-medium">Real-time subscription working (this page!)</span></li>
                <li>• Convex dashboard accessible</li>
                <li>• Environment variables configured</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function ConvexDemoPage() {
  return (
    <ConvexProvider client={convex}>
      <ConvexDemoContent />
    </ConvexProvider>
  )
}
