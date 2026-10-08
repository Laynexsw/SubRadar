/**
 * SubRadar — Toast Notification System
 */
export function srShowToast(message) {
  let toast = document.getElementById('sr-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'sr-toast';
    toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 rounded-full apple-glass border border-white/20 text-xs font-mono text-white shadow-2xl flex items-center gap-2 transition-all duration-300 opacity-0 pointer-events-none translate-y-2';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span><span>${message}</span>`;
  toast.classList.remove('opacity-0', 'translate-y-2', 'pointer-events-none');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2', 'pointer-events-none');
  }, 2600);
}
