export type ToastType = 'success' | 'error' | 'info' | 'warning';

export function showToast(message: string, type: ToastType = 'info') {
  const notification = document.createElement('div');
  const bgClass =
    type === 'success'
      ? 'bg-success text-success-foreground'
      : type === 'error'
      ? 'bg-destructive text-destructive-foreground'
      : type === 'warning'
      ? 'bg-warning text-warning-foreground'
      : 'bg-primary text-primary-foreground';

  notification.className = `fixed top-4 right-4 ${bgClass} px-6 py-3 rounded-lg shadow-elevation-3 z-50 animate-in slide-in-from-right-2`;
  notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <div class="w-2 h-2 rounded-full bg-current animate-pulse"></div>
        <span class="font-medium">${message}</span>
      </div>
    `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slide-out-to-right-2 0.2s ease-in forwards';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 200);
  }, 3000);
}
