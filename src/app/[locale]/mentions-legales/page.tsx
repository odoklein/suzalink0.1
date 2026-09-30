import { legalPage } from "@/components/templates/LegalPage";

const page = legalPage("mentions-legales", "2026-09-30");
export const generateMetadata = page.generateMetadata;
export default page.Page;
