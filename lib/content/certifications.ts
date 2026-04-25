export type CertificationStatus = "active" | "expired";

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  year: number;
  credentialId?: string;
  url: string;
  status: CertificationStatus;
};

export const certifications: Certification[] = [
  {
    id: "aws-sap",
    name: "AWS Certified Solutions Architect — Professional",
    issuer: "Amazon Web Services",
    year: 2024,
    credentialId: undefined,
    url: "https://aws.amazon.com/certification/",
    status: "active",
  },
  {
    id: "aws-devops-pro",
    name: "AWS Certified DevOps Engineer — Professional",
    issuer: "Amazon Web Services",
    year: 2023,
    credentialId: undefined,
    url: "https://aws.amazon.com/certification/",
    status: "active",
  },
  {
    id: "cka",
    name: "Certified Kubernetes Administrator (CKA)",
    issuer: "CNCF / Linux Foundation",
    year: 2023,
    credentialId: undefined,
    url: "https://www.cncf.io/certification/cka/",
    status: "active",
  },
  {
    id: "cks",
    name: "Certified Kubernetes Security Specialist (CKS)",
    issuer: "CNCF / Linux Foundation",
    year: 2024,
    credentialId: undefined,
    url: "https://www.cncf.io/certification/cks/",
    status: "active",
  },
  {
    id: "terraform-associate",
    name: "HashiCorp Certified: Terraform Associate",
    issuer: "HashiCorp",
    year: 2023,
    credentialId: undefined,
    url: "https://www.hashicorp.com/certification",
    status: "active",
  },
  {
    id: "azure-architect-expert",
    name: "Microsoft Certified: Azure Solutions Architect Expert",
    issuer: "Microsoft",
    year: 2024,
    credentialId: undefined,
    url: "https://learn.microsoft.com/credentials/certifications/azure-solutions-architect/",
    status: "active",
  },
  {
    id: "gcp-devops-engineer",
    name: "Google Cloud Professional Cloud DevOps Engineer",
    issuer: "Google Cloud",
    year: 2023,
    credentialId: undefined,
    url: "https://cloud.google.com/certification",
    status: "active",
  },
  {
    id: "vault-associate",
    name: "HashiCorp Certified: Vault Associate",
    issuer: "HashiCorp",
    year: 2024,
    credentialId: undefined,
    url: "https://www.hashicorp.com/certification",
    status: "active",
  },
];

export function issuerInitials(issuer: string): string {
  if (issuer.startsWith("Amazon")) return "AWS";
  if (issuer.startsWith("Google")) return "GCP";
  if (issuer.startsWith("Microsoft")) return "AZ";
  if (issuer.startsWith("HashiCorp")) return "HC";
  if (issuer.startsWith("CNCF")) return "K8s";
  return issuer
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}
