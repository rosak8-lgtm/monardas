import { Button } from "@/components/site";
export default function NotFound() {
  return (
    <section className="container page-hero">
      <p className="eyebrow">404 / PAGE NOT FOUND</p>
      <h1>
        Let’s get you
        <br />
        <span>back on track.</span>
      </h1>
      <p>That page isn’t here. Your next opportunity might be.</p>
      <Button href="/">Back to home</Button>
    </section>
  );
}
