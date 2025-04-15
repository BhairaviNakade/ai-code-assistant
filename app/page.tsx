"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Send, Sparkles } from "lucide-react"
import axios from "axios"

export default function FancyInputBox() {
  const [inputValue, setInputValue] = useState("")
  const [isListening, setIsListening] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Function to handle voice commands
  const handleVoiceCommand = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in your browser. Try Chrome or Edge.")
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = "en-US"
    recognition.interimResults = false

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event : any) => {
      const transcript = event.results[0][0].transcript
      setInputValue(transcript)
    }

    recognition.onend = () => {
      setIsListening(false)
      // Focus the input after voice recognition completes
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }

    recognition.start()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      console.log("Input submitted:", inputValue)
      // Here you would typically do something with the input
      // For demonstration, we'll just clear it
      const response = axios.get("http://localhost:5000/", {
        params: { prompt: inputValue }
      });
      setInputValue("")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <Card className="w-full max-w-2xl bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-xl">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold text-white">
            <Sparkles className="h-6 w-6 text-primary" />
            Code Command
          </CardTitle>
        </CardHeader>

        <CardContent className="pb-2">
          <div className="text-center text-gray-400 text-sm mb-4">Type your command or use voice input</div>

          <form onSubmit={handleSubmit} className="relative">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-purple-500/50 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>

              <div className="relative flex items-center bg-gray-900 rounded-lg p-1">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter your command..."
                  className="flex-grow border-0 bg-transparent text-white focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={`mr-1 ${isListening ? "text-red-500 animate-pulse" : "text-gray-400 hover:text-white"}`}
                  onClick={handleVoiceCommand}
                >
                  <Mic className="h-5 w-5" />
                </Button>

                <Button
                  type="submit"
                  className="bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-500/90 text-white"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="pt-2 text-center text-xs text-gray-500">
          Press the microphone icon to use voice commands
        </CardFooter>
      </Card>
    </div>
  )
}

