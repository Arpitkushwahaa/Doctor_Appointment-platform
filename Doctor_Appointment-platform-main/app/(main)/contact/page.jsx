"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle
} from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge
            variant="outline"
            className="bg-emerald-900/30 border-emerald-700/30 px-4 py-2 text-emerald-400 text-sm font-medium mb-6"
          >
            Get in Touch
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Get in <span className="text-emerald-400">Touch</span>
          </h1>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
            Have questions about our services? Need support? We're here to help! 
            Reach out to us through any of the channels below.
          </p>
        </div>

        {/* Contact Information */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-card border-emerald-900/20 hover:border-emerald-800/40 transition-all duration-300 text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-emerald-900/20 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-emerald-400" />
              </div>
              <CardTitle className="text-xl text-white">Email Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2">kushwahaarpit360@gmail.com</p>
              <p className="text-muted-foreground">arpitkushwaha4107@gmail.com</p>
              <p className="text-sm text-muted-foreground/70 mt-3">
                We typically respond within 24 hours
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-emerald-900/20 hover:border-emerald-800/40 transition-all duration-300 text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-emerald-900/20 rounded-full flex items-center justify-center mb-4">
                <Phone className="h-8 w-8 text-emerald-400" />
              </div>
              <CardTitle className="text-xl text-white">Call Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2">+91 9580271088</p>
              
              <p className="text-sm text-muted-foreground/70 mt-3">
                Available Mon-Fri, 9AM-6PM EST
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-emerald-900/20 hover:border-emerald-800/40 transition-all duration-300 text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-emerald-900/20 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8 text-emerald-400" />
              </div>
              <CardTitle className="text-xl text-white">Visit Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2">Prayagraj, Uttar Pradesh</p>
              <p className="text-muted-foreground">Medical District, Prayagraj</p>
              <p className="text-sm text-muted-foreground/70 mt-3">
                By appointment only
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Business Hours */}
        <div className="mb-16">
          <Card className="bg-card border-emerald-900/20 hover:border-emerald-800/40 transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-emerald-900/20 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-emerald-400" />
              </div>
              <CardTitle className="text-2xl text-white">Business Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                <div>
                  <h3 className="font-semibold text-white mb-4">Customer Support</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 6:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>10:00 AM - 4:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-4">Emergency Support</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex justify-between">
                      <span>24/7 Hotline</span>
                      <span>+91 9580271088</span>
                    </div>
                    <div className="text-sm text-muted-foreground/70 mt-3">
                      For urgent medical emergencies, please call 911 or visit your nearest emergency room.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">
              How Can We Help You?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Whether you have questions about our services, need technical support, 
              or want to provide feedback, we're here to help.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-card border-emerald-900/20 hover:border-emerald-800/40 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-900/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-emerald-400" />
                  </div>
                  <CardTitle className="text-xl text-white">Common Questions</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-muted-foreground">
                  <p>• How do I book an appointment?</p>
                  <p>• What are your consultation fees?</p>
                  <p>• How do I become a doctor on your platform?</p>
                  <p>• Is my medical information secure?</p>
                  <p>• What payment methods do you accept?</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-emerald-900/20 hover:border-emerald-800/40 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-900/20 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-emerald-400" />
                  </div>
                  <CardTitle className="text-xl text-white">Response Time</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We aim to respond to all inquiries within 24 hours during business days. 
                  For urgent matters, please use our emergency hotline.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="bg-card border-emerald-900/20 hover:border-emerald-800/40 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg text-white">
                  How do I book an appointment?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Browse our doctor directory, select a specialist, choose an available time slot, 
                  and complete your booking. You'll receive confirmation via email.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-emerald-900/20 hover:border-emerald-800/40 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg text-white">
                  What are your consultation fees?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Consultation fees vary by doctor and specialty. You can view pricing details 
                  on each doctor's profile before booking.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-emerald-900/20 hover:border-emerald-800/40 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg text-white">
                  Is my medical information secure?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, we use HIPAA-compliant security measures and end-to-end encryption 
                  to protect all your medical information and communications.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-emerald-900/20 hover:border-emerald-800/40 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg text-white">
                  How do I become a doctor on your platform?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Visit our doctor registration page, submit your credentials for verification, 
                  and our team will review your application within 48 hours.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-emerald-900/30 to-emerald-950/20 border border-emerald-800/20 rounded-2xl shadow-lg p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Still Have Questions?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            If you couldn't find the answer you're looking for, please don't hesitate 
            to reach out to us through any of our contact channels above.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/doctors"
              className="inline-flex items-center justify-center px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Find a Doctor
            </a>
            <a
              href="/pricing"
              className="inline-flex items-center justify-center px-8 py-3 border border-emerald-600 text-emerald-400 font-semibold rounded-lg hover:bg-emerald-900/20 transition-colors"
            >
              View Pricing
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
