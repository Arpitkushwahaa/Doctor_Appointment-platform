import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Stethoscope, 
  Users, 
  Shield, 
  Clock, 
  Heart, 
  Star,
  CheckCircle,
  Award
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge
            variant="outline"
            className="bg-emerald-900/30 border-emerald-700/30 px-4 py-2 text-emerald-400 text-sm font-medium mb-6"
          >
            About MediMeet
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            About <span className="text-emerald-400">MediMeet</span>
          </h1>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
            Connecting patients with qualified healthcare professionals through innovative 
            telemedicine solutions. We're revolutionizing healthcare access with secure, 
            convenient, and reliable virtual consultations.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-card border-emerald-900/20 hover:border-emerald-800/40 transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-emerald-900/20 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-emerald-400" />
              </div>
              <CardTitle className="text-2xl text-white">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center leading-relaxed">
                To democratize healthcare access by providing a seamless platform that 
                connects patients with qualified doctors, making quality healthcare 
                available to everyone, everywhere.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-emerald-900/20 hover:border-emerald-800/40 transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-emerald-900/20 rounded-full flex items-center justify-center mb-4">
                <Star className="h-8 w-8 text-emerald-400" />
              </div>
              <CardTitle className="text-2xl text-white">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center leading-relaxed">
                To become the leading telemedicine platform that transforms how people 
                access healthcare, ensuring quality, convenience, and affordability for all.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Why Choose MediMeet?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-card border-emerald-900/20 hover:border-emerald-800/40 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-emerald-900/20 rounded-full flex items-center justify-center mb-3">
                  <Stethoscope className="h-6 w-6 text-emerald-400" />
                </div>
                <CardTitle className="text-lg text-white">Expert Doctors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center text-sm">
                  Verified and qualified healthcare professionals across all specialties
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-emerald-900/20 hover:border-emerald-800/40 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-emerald-900/20 rounded-full flex items-center justify-center mb-3">
                  <Shield className="h-6 w-6 text-emerald-400" />
                </div>
                <CardTitle className="text-lg text-white">Secure & Private</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center text-sm">
                  HIPAA-compliant platform with end-to-end encryption for your privacy
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-emerald-900/20 hover:border-emerald-800/40 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-emerald-900/20 rounded-full flex items-center justify-center mb-3">
                  <Clock className="h-6 w-6 text-emerald-400" />
                </div>
                <CardTitle className="text-lg text-white">24/7 Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center text-sm">
                  Access healthcare anytime, anywhere with flexible scheduling
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-16">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-400 mb-2">500+</div>
              <div className="text-muted-foreground">Qualified Doctors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-400 mb-2">10K+</div>
              <div className="text-muted-foreground">Happy Patients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-400 mb-2">50+</div>
              <div className="text-muted-foreground">Medical Specialties</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-400 mb-2">99%</div>
              <div className="text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Quality</h3>
              <p className="text-muted-foreground text-sm">
                We maintain the highest standards in healthcare delivery
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Accessibility</h3>
              <p className="text-muted-foreground text-sm">
                Making healthcare available to everyone, everywhere
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Trust</h3>
              <p className="text-muted-foreground text-sm">
                Building lasting relationships through transparency
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Excellence</h3>
              <p className="text-muted-foreground text-sm">
                Striving for continuous improvement in everything we do
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-emerald-900/30 to-emerald-950/20 border border-emerald-800/20 rounded-2xl shadow-lg p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Experience Better Healthcare?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of patients who have already discovered the convenience 
            of virtual healthcare with MediMeet.
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
