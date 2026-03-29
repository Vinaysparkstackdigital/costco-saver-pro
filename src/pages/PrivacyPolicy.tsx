import { Helmet } from "react-helmet";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Privacy Policy - Cost Saver</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
        <Header />

        <main className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground">Back</span>
            </div>

            <article className="prose prose-invert max-w-none">
              <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
              <p className="text-muted-foreground mb-6">
                <strong>Last Updated: March 29, 2026</strong>
              </p>

              <section className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mt-8 mb-4">1. Introduction</h2>
                  <p>
                    Cost Saver ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and website (collectively, the "Service").
                  </p>
                  <p>
                    Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our Service.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mt-8 mb-4">2. Information We Collect</h2>
                  <h3 className="text-lg font-semibold mt-4 mb-2">2.1 Information You Provide</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Account Information:</strong> Email, password (hashed), authentication method (Apple, Google, Facebook, or email)</li>
                    <li><strong>Receipt Data:</strong> Receipt images, extracted item names, prices, quantities, purchase dates, store locations, and receipt numbers</li>
                    <li><strong>Price Tracking Data:</strong> Items you choose to track, purchase prices, current prices, and price history</li>
                    <li><strong>Device Information:</strong> Device type, operating system, app version, unique device identifier</li>
                  </ul>

                  <h3 className="text-lg font-semibold mt-4 mb-2">2.2 Information Collected Automatically</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Usage Data:</strong> Pages viewed, features used, time spent, interactions, crash logs</li>
                    <li><strong>Location Data:</strong> Approximate location (if you enable push notifications)</li>
                    <li><strong>Cookies & Analytics:</strong> Session data, preferences, analytics providers (e.g., Firebase)</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mt-8 mb-4">3. How We Use Your Information</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide, operate, and improve the Service</li>
                    <li>Process receipt uploads and extract item data via OCR/AI</li>
                    <li>Check product prices using product search APIs</li>
                    <li>Send price drop notifications and alerts (with your consent)</li>
                    <li>Authenticate users and maintain account security</li>
                    <li>Analyze usage patterns to improve user experience</li>
                    <li>Comply with legal obligations and enforce our Terms of Service</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mt-8 mb-4">4. How We Share Your Information</h2>
                  <h3 className="text-lg font-semibold mt-4 mb-2">4.1 Third-Party Service Providers</h3>
                  <p>We share information with:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Supabase:</strong> Database and authentication provider</li>
                    <li><strong>Google AI (Gemini):</strong> Receipt OCR parsing</li>
                    <li><strong>Firecrawl API:</strong> Product price lookup</li>
                    <li><strong>Google Services:</strong> Authentication (Google Sign-In), Push Notifications (Firebase)</li>
                    <li><strong>Apple Services:</strong> Authentication (Sign in with Apple)</li>
                    <li><strong>Facebook:</strong> Authentication (Facebook Login)</li>
                  </ul>
                  <p className="mt-3 text-sm text-muted-foreground">
                    These providers process your data only as necessary to provide the Service and are contractually bound by confidentiality.
                  </p>

                  <h3 className="text-lg font-semibold mt-4 mb-2">4.2 Legal Requirements</h3>
                  <p>
                    We may disclose your information if required by law, court order, or government request.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mt-8 mb-4">5. Data Security</h2>
                  <p>
                    We implement industry-standard security measures including encryption, secure authentication, and regular security audits. However, no system is completely secure. We recommend using a strong password and enabling two-factor authentication where available.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mt-8 mb-4">6. Your Privacy Rights</h2>
                  <h3 className="text-lg font-semibold mt-4 mb-2">6.1 Data Access & Portability</h3>
                  <p>
                    You can request a copy of your personal data by contacting us.
                  </p>

                  <h3 className="text-lg font-semibold mt-4 mb-2">6.2 Data Deletion</h3>
                  <p>
                    You can delete your account and associated data at any time from the Account Settings page. This will permanently remove all your tracked items, receipt data, and account information from our servers.
                  </p>

                  <h3 className="text-lg font-semibold mt-4 mb-2">6.3 Opt-Out</h3>
                  <p>
                    You can disable push notifications and other optional features in your device settings.
                  </p>

                  <h3 className="text-lg font-semibold mt-4 mb-2">6.4 GDPR & CCPA Compliance</h3>
                  <p>
                    If you are in the EU (GDPR) or California (CCPA), you have additional rights including the right to access, correct, and delete your personal data. Contact us to exercise these rights.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mt-8 mb-4">7. Retention</h2>
                  <p>
                    We retain your data for as long as your account is active. Upon account deletion, your data is permanently removed within 30 days. Deleted data cannot be recovered.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mt-8 mb-4">8. Children's Privacy</h2>
                  <p>
                    The Service is not directed to individuals under age 13. We do not knowingly collect information from children under 13. If we become aware of such collection, we will delete it promptly.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mt-8 mb-4">9. Changes to This Policy</h2>
                  <p>
                    We may update this Privacy Policy periodically. Significant changes will be communicated via email or prominent notice in the app. Continued use of the Service constitutes acceptance of the updated policy.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mt-8 mb-4">10. Contact Us</h2>
                  <p>
                    For privacy inquiries, account concerns, or to exercise your rights:
                  </p>
                  <p className="mt-3">
                    <strong>Email:</strong> info@sparkstackdigital.com<br />
                    <strong>Company:</strong> SparkStack Digital LLC<br />
                    <strong>Response Time:</strong> We respond to requests within 30 days
                  </p>
                </div>
              </section>
            </article>
          </div>
        </main>

        <footer className="mt-20 py-8 border-t border-border bg-card/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <p>© 2026 Cost Saver by SparkStack Digital LLC.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default PrivacyPolicy;
