import { useEffect, useState, type FormEvent } from 'react';
import { Copy, Link as LinkIcon, MessageSquareText, CheckCircle } from 'lucide-react';
import { WEDDING, PREFIXES, type Prefix, buildDisplayName } from './config';

function buildMessage(displayName: string, link: string) {
  return `Dear ${displayName} ❤️

With joyful hearts, we warmly invite you to celebrate one of the most special days of our lives as we begin our journey together.

Please view our wedding invitation and all the event details through the link below 🌐:

${link}

Your presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.

With love,
❤️ ${WEDDING.groomName} & ${WEDDING.brideName}`;
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for non-secure contexts / older browsers
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  }
}

export function AdminPage() {
  const [prefix, setPrefix] = useState<Prefix>('Mr.');
  const [guestName, setGuestName] = useState('');
  const [generated, setGenerated] = useState<{ displayName: string; link: string } | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    document.title = `Invitation Links · ${WEDDING.brideName} & ${WEDDING.groomName}`;
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  const livePreviewName = buildDisplayName(prefix, guestName);

  const handleGenerate = (e?: FormEvent) => {
    e?.preventDefault();
    const displayName = buildDisplayName(prefix, guestName);
    if (!displayName) return;
    const link = `${window.location.origin}/${encodeURIComponent(displayName)}`;
    setGenerated({ displayName, link });
  };

  // Invalidate the generated link if inputs change after generating
  const isStale = generated !== null && generated.displayName !== livePreviewName;
  const canCopy = generated !== null && !isStale;

  const message = generated ? buildMessage(generated.displayName, generated.link) : '';

  const handleCopyLink = async () => {
    if (!canCopy) return;
    setToast((await copyText(generated!.link)) ? 'Link copied!' : 'Copy failed');
  };

  const handleCopyMessage = async () => {
    if (!canCopy) return;
    setToast((await copyText(message)) ? 'Message copied!' : 'Copy failed');
  };

  const inputClass =
    'w-full px-4 py-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-brand-beige-deep/40 focus:border-brand-beige-deep outline-none transition-all bg-white font-sans text-stone-800';

  return (
    <div className="min-h-screen bg-brand-ivory py-12 px-4 sm:px-6 font-sans text-stone-800 flex items-start sm:items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-[0_8px_30px_rgba(71,112,90,0.12)] border border-stone-200/70 overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-brand-beige via-brand-gold to-brand-beige-deep" />
        <div className="px-6 py-8 sm:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-display text-brand-beige-deep mb-1">
              {WEDDING.brideName} &amp; {WEDDING.groomName}
            </h1>
            <p className="text-stone-500 text-xs uppercase tracking-[0.25em]">Invitation link generator</p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-4">
              <div>
                <label htmlFor="prefix" className="block text-sm font-medium text-stone-700 mb-1">
                  Prefix
                </label>
                <select
                  id="prefix"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value as Prefix)}
                  className={inputClass}
                >
                  {PREFIXES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="guestName" className="block text-sm font-medium text-stone-700 mb-1">
                  Guest Name
                </label>
                <input
                  id="guestName"
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Sanjaya"
                  autoComplete="off"
                  className={inputClass}
                />
              </div>
            </div>

            {livePreviewName && (
              <p className="text-sm text-stone-500 text-center">
                Greeting: <span className="font-semibold text-brand-beige-deep">Dear {livePreviewName} ❤️</span>
              </p>
            )}

            <button
              type="submit"
              disabled={!livePreviewName}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-beige-deep text-white text-sm tracking-[0.2em] uppercase shadow-lg hover:bg-brand-mocha transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LinkIcon className="w-4 h-4" />
              Generate Link
            </button>
          </form>

          {generated && (
            <div className="mt-8 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-2 font-semibold">Generated link</p>
                <div className="px-3 py-2.5 bg-brand-ivory border border-stone-200 rounded-lg text-sm break-all text-stone-700 select-all">
                  {generated.link}
                </div>
                {isStale && (
                  <p className="text-xs text-amber-700 mt-2">Inputs changed — click Generate Link again to update.</p>
                )}
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-2 font-semibold">Message preview</p>
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-stone-700 bg-brand-ivory border border-stone-200 rounded-lg p-4 max-h-80 overflow-y-auto">
                  {message}
                </pre>
              </div>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleCopyLink}
              disabled={!canCopy}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-brand-beige-deep text-brand-beige-deep text-xs tracking-[0.15em] uppercase hover:bg-brand-beige-deep/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Copy className="w-4 h-4" />
              Copy Link Only
            </button>
            <button
              type="button"
              onClick={handleCopyMessage}
              disabled={!canCopy}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-brand-beige text-white text-xs tracking-[0.15em] uppercase hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <MessageSquareText className="w-4 h-4" />
              Copy Full Message
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-stone-900 text-white text-sm px-4 py-2.5 rounded-full shadow-xl"
        >
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          {toast}
        </div>
      )}
    </div>
  );
}
