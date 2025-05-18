document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.favorite').forEach(btn => {
        const icon = btn.querySelector('.material-symbols-outlined');

        btn.addEventListener('mouseenter', () => {
          if (!btn.classList.contains('active')) {
            icon.textContent = 'bookmark_add';
          }
        });

        btn.addEventListener('mouseleave', () => {
          if (!btn.classList.contains('active')) {
            icon.textContent = 'bookmark';
          }
        });

        btn.addEventListener('click', () => {
          const isActive = btn.classList.toggle('active');
          icon.textContent = isActive ? 'bookmark_added' : 'bookmark';

          btn.classList.add('bounced');
          setTimeout(() => btn.classList.remove('bounced'), 400);
        });
      });
    });