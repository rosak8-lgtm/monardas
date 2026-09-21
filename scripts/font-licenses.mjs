import fs from "node:fs/promises";
for (const [family, file] of [
  ["geist", "Geist-OFL.txt"],
  ["instrumentserif", "Instrument-Serif-OFL.txt"],
]) {
  const response = await fetch(
    `https://raw.githubusercontent.com/google/fonts/main/ofl/${family}/OFL.txt`,
  );
  if (!response.ok)
    throw new Error(`Font license download failed: ${response.status}`);
  const license = await response.text();
  if (!license.includes("SIL OPEN FONT LICENSE"))
    throw new Error("Unexpected license content");
  await fs.writeFile(`src/app/fonts/${file}`, license);
  console.log(`${family}: SIL Open Font License saved.`);
}
