import { CertificateForm } from "@/components/certificate-form"
import CertificateFormContainer from "@/components/CertificateContainer"

export default function Home() {
  return (
    <div className="container mx-auto max-w-2xl py-10 bg-white ">
      <div className="space-y-6">
        <CertificateFormContainer />
      </div>
    </div>
  )
}
