import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ThemeDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header with Theme Toggle */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold">Theme Demo</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Introduction Section */}
        <section className="mb-12">
          <h2 className="mb-4 text-3xl font-bold">TailwindCSS 4 + tweakcn Tangerine Theme</h2>
          <p className="text-lg text-muted-foreground">
            This page demonstrates the theme system with light/dark mode switching.
            Try toggling the theme using the button in the header to see the color transitions.
          </p>
        </section>

        {/* Color Palette Section */}
        <section className="mb-12">
          <h3 className="mb-6 text-2xl font-semibold">Color Palette</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Background & Foreground</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-background p-4">
                  <p className="text-foreground">Background with Foreground text</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Primary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-primary p-4">
                  <p className="text-primary-foreground">Primary with Primary Foreground</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Secondary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-secondary p-4">
                  <p className="text-secondary-foreground">Secondary with Secondary Foreground</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Muted</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-muted-foreground">Muted with Muted Foreground</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-accent p-4">
                  <p className="text-accent-foreground">Accent with Accent Foreground</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Destructive</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-destructive p-4">
                  <p className="text-destructive-foreground">Destructive with Destructive Foreground</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Button Variants Section */}
        <section className="mb-12">
          <h3 className="mb-6 text-2xl font-semibold">Button Components</h3>
          <Card>
            <CardHeader>
              <CardTitle>Button Variants</CardTitle>
              <CardDescription>All available button styles from shadcn/ui</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex flex-wrap gap-4">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">
                  <span className="sr-only">Icon button</span>
                  ⚡
                </Button>
              </div>
            </CardFooter>
          </Card>
        </section>

        {/* Form Components Section */}
        <section className="mb-12">
          <h3 className="mb-6 text-2xl font-semibold">Form Components</h3>
          <Card>
            <CardHeader>
              <CardTitle>Input & Label Components</CardTitle>
              <CardDescription>Form elements with proper styling and accessibility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Enter your password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="disabled">Disabled Input</Label>
                <Input id="disabled" disabled placeholder="This input is disabled" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Submit Form</Button>
            </CardFooter>
          </Card>
        </section>

        {/* Typography Section */}
        <section className="mb-12">
          <h3 className="mb-6 text-2xl font-semibold">Typography</h3>
          <Card>
            <CardHeader>
              <CardTitle>Text Styles</CardTitle>
              <CardDescription>Font sizes and text colors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h1 className="text-4xl font-bold">Heading 1</h1>
                <h2 className="text-3xl font-semibold">Heading 2</h2>
                <h3 className="text-2xl font-semibold">Heading 3</h3>
                <h4 className="text-xl font-semibold">Heading 4</h4>
              </div>
              <div className="space-y-2">
                <p className="text-base">Base text - The quick brown fox jumps over the lazy dog</p>
                <p className="text-sm text-muted-foreground">Small muted text - The quick brown fox jumps over the lazy dog</p>
                <p className="text-lg font-medium">Large medium text - The quick brown fox jumps over the lazy dog</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Card Grid Section */}
        <section>
          <h3 className="mb-6 text-2xl font-semibold">Card Layouts</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Card Title 1</CardTitle>
                <CardDescription>This is a description for the first card</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card content goes here. This demonstrates how cards look in the current theme.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Action</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Card Title 2</CardTitle>
                <CardDescription>This is a description for the second card</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Another card with consistent styling and proper spacing.</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Primary Action</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Card Title 3</CardTitle>
                <CardDescription>This is a description for the third card</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Cards automatically adapt to the selected theme.</p>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="secondary" className="flex-1">Cancel</Button>
                <Button className="flex-1">Confirm</Button>
              </CardFooter>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
