"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { UserRound, Mail, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GraduationCap } from "lucide-react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Please enter your username.",
  }),
  // lastname: z.string().min(1, {
  //   message: "Last name cannot be empty.",
  // }),
  teamName: z.string().min(2,{
    message: "Please enter your team name.",
  }),
  //  rollno: z.string().min(1, {
  //   message: "Roll number cannot be empty.",
  // }),
})

export function CertificateForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      teamName: "",
      // rollno: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsGenerating(true);
      console.log("Submitting form with values:", values);

      const response = await fetch("/api/verify-and-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        // Show error message
        toast({
          title: "Error",
          description: data.message || "Participant details not found in registered list",
          variant: "destructive",
        });
        return;
      }

      // Success - show success message
      toast({
        title: "Success! 🎉",
        description: "Your certificate has been generated successfully!",
        variant: "default",
      });

      // Download the certificate
      const link = document.createElement("a");
      link.href = `data:application/pdf;base64,${data.data}`;
      link.download = `${values.username.replace(/\s+/g, "_")}_Certificate.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Reset form
      form.reset();

    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (

     <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black">Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <UserRound className="absolute left-3 top-3 h-4 w-4 text-black/60" />
                  <Input 
                    placeholder="John" 
                    {...field} 
                    className="w-full pl-10 py-2 bg-transparent border border-black/20 rounded-md text-black placeholder:text-black/50 focus:outline-none focus:border-blue-400 focus:ring-2" 
                  />
                </div>
              </FormControl>
              <FormDescription className="text-black/70 text-xs">
                Enter your name exactly as registered for the event.
              </FormDescription>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />
        
        {/* <FormField
          control={form.control}
          name="lastname"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black">Last Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <UserRound className="absolute left-3 top-3 h-4 w-4 text-black/60" />
                  <Input 
                    placeholder="Doe" 
                    {...field} 
                    className="pl-10 bg-white/10 border-black/20 text-black placeholder:text-black/50 focus:border-blue-400 focus:ring-blue-400/20" 
                  />
                </div>
              </FormControl>
              <FormDescription className="text-black/70 text-xs">
                Enter your last name exactly as registered for the event.
              </FormDescription>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        /> */}

        <FormField
          control={form.control}
          name="teamName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black">Team Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-black/60" />
                  <Input 
                    type="text" 
                    placeholder="Team Random" 
                    {...field} 
                    className="pl-10 bg-white/10 border-black/20 text-black placeholder:text-black/50 focus:border-blue-400 focus:ring-blue-400/20" 
                  />
                </div>
              </FormControl>
              <FormDescription className="text-black/70 text-xs">
                Enter the email you used during registration.
              </FormDescription>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="rollno"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black">Roll Number</FormLabel>
              <FormControl>
                <div className="relative">
                  <UserRound className="absolute left-3 top-3 h-4 w-4 text-black/60" />
                  <Input 
                    placeholder="Enter your roll number" 
                    {...field} 
                    className="pl-10 bg-white/10 border-black/20 text-black placeholder:text-black/50 focus:border-blue-400 focus:ring-blue-400/20" 
                  />
                </div>
              </FormControl>
              <FormMessage className="text-red-300" />
            </FormItem>
          )}
        /> */}


        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <button 
            type="submit" 
            className="w-full bg-black hover:from-blue-500 hover:to-violet-600 text-white border-0 py-2.5 rounded-md shadow-lg shadow-blue-500/30 flex items-center justify-center"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Verifying & Generating...</span>
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                <span>Verify & Download Certificate</span>
              </>
            )}
          </button>
        </motion.div>
      </form>
    </Form>
  )
}
