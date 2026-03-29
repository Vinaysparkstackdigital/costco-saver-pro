import { Helmet } from "react-helmet";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Terms of Service - Cost Saver</title>
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
              <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
              <p className="text-muted-foreground mb-6">
                <strong>Last Updated: March 29, 2026</strong>
              </p>

              <section className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
                  <p>
                    By accessing and using Cost Saver ("Service"), operated by SparkStack Digital LLC ("Company," "we," "us," "our"), you agree to be bound by these Terms of Service. If you do not agree to abide by the foregoing, please do not use this Service.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mt-8 mb-4">2. Use License</h2>
                  <p>
                    Permission is granted to temporarily download one copy of the materials (information or software) on Cost Saver for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Modifying or copying the materials</li>
                    <li>Using the materials for any commercial purpose or for any public display</li>
                    <li>Attempting to decompile or reverse engineer any software contained on the Service</li>
                    <li>Removing any copyright or other proprietary notations from the materials</li>
                    <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
                    <li>Unlawfully accessing, maintaining, or updating tracked items or receipt data</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mt-8 mb-4">3. Disclaimer</h2>
                  <p>
                    The materials on Cost Saver are provided on an "as-is" basis. The Company makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                  </p>
                  <p className="mt-3 text-sm font-semibold text-yellow-600">
                    IMPORTANT: Cost Saver is not affiliated with Costco Wholesale Corporation. Price information is provided for informational purposes only. Users are solely responsible for verifying prices with Costco and following Costco's price adjustment and refund policies. The Company is not liable for any financial losses or disputes with Costco.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mt-8 mb-4">4. Limitations of Liability</h2>
                  <p>
                    In no event shall the Company or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use Cost Saver, even if the Company or an authorized representative has been notified orally or in writing of the possibility of such damage.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mt-8 mb-4">5. Accuracy of Materials</h2>
                  <p>
                    The materials appearing on Cost Saver could include technical, typographical, or photographic errors. The Company does not warrant that any of the materials on the Service are accurate, complete, or current. The Company may make changes to the materials contained on the Service at any time without notice.
                  </p>
                  <p className="mt-3 text-sm">
                    Price data may be delayed, inaccurate, or unavailable. Users should independently verify all price information with Costco.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mt-8 mb-4">6. Materials and Content</h2>
                  <p>
                    The Company has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by the Company of the site. Use of any such linked website is at the user's own risk.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mt-8 mb-4">7. Modifications</h2>
                  <p>
                    The Company may revise these Terms of Service for the Service at any time without notice. By using this Service, you are agreeing to be bound by the then-current version of these Terms of Service.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mt-8 mb-4">8. Governing Law</h2>
                  <p>
                    These Terms of Service and any separate agreements we provide will be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mt-8 mb-4">9. User Accounts</h2>
                  <h3 className="text-lg font-semibold mt-4 mb-2">9.1 Account Responsibility</h3>
                  <p>
                    You are responsible for maintaining the confidentiality of your account information and password and for restricting access to your device. You agree to accept responsibility for all activities that occur under your account.
                  </p>

                  <h3 className="text-lg font-semibold mt-4 mb-2">9.2 Account Data</h3>
                  <p>
                    Receipt images and extracted data are stored securely. You acknowledge that this data is processed by third parties (OCR/AI services) to provide the Service. You retain ownership of your data and may request deletion at any time.
                  </p>

                  <h3 className="text-lg font-semibold mt-4 mb-2">9.3 Account Deletion</h3>
                  <p>
                    You can delete your account and all associated data from Account Settings at any time. Upon deletion, your account and data will be permanently removed and cannot be recovered.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mt-8 mb-4">10. User Content</h2>
                  <p>
                    In these Terms of Service, "User Content" shall mean any audio, video, text, images, or other material you choose to display on this Service. By displaying User Content, you grant the Company a worldwide, non-exclusive, royalty-free license to reproduce, adapt, translate and distribute it on the Service and for promoting the Service, in any media.
                  </p>
                  <p className="mt-3">
                    User Content must not be illegal or unlawful, must not infringe any third-party rights, and must comply with any content policies established by the Company.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mt-8 mb-4">11. License and Site Access</h2>
                  <p>
                    The Company grants you a limited license to access and use the Service for personal, non-commercial purposes. You may not copy, reproduce, distribute, transmit, broadcast, display, sell, license, or otherwise exploit any content for any other purposes without the prior written consent of the Company.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mt-8 mb-4">12. Third-Party Links and Content</h2>
                  <p>
                    Cost Saver may contain links to third-party websites and services. The Company is not responsible for third-party content, including price data from Costco or other sources accessed through the Service. Users are responsible for reviewing third-party terms and policies.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mt-8 mb-4">13. Prohibited Activities</h2>
                  <p>You agree not to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe on intellectual property rights of the Company or third parties</li>
                    <li>Harass, threaten, defame, or abuse others</li>
                    <li>Attempt to gain unauthorized access to the Service or other users' accounts</li>
                    <li>Use bots, scrapers, or automated tools without permission</li>
                    <li>Spam or send unsolicited communications</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mt-8 mb-4">14. Contact Information</h2>
                  <p>
                    If you have any questions about these Terms of Service:
                  </p>
                  <p className="mt-3">
                    <strong>Email:</strong> support@costcosaver.com<br />
                    <strong>Company:</strong> SparkStack Digital LLC
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

export default TermsOfService;
