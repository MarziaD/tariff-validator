import { FileUpload } from "../src/components/FileUpload";
import { Providers } from "./providers";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <Providers>
        <FileUpload />
      </Providers>
    </main>
  );
}
