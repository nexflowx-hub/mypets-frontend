const PIX_LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/5/50/Pix_%28Brazil%29_logo.svg";

export function PixBrand({ className = "h-7 w-auto" }: { className?: string }) {
  return (
    // The artwork is kept unmodified: no gradients, shadows, filters or recolouring are applied to the Pix mark.
    // Source identifies Banco Central do Brasil as author/source of the mark.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={PIX_LOGO_URL}
      alt="Pix"
      className={className}
      loading="eager"
      decoding="async"
      referrerPolicy="no-referrer"
    />
  );
}
