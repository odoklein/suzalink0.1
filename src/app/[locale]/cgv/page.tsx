import { legalPage } from "@/components/templates/LegalPage";

const page = legalPage("cgv", "2026-09-30");
export const generateMetadata = page.generateMetadata;
export default page.Page;
