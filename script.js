const mainContent = document.getElementById('main-content');

	mainContent.innerHTML = html;

	if (pageKey === 'contact') {
		const form = document.getElementById('contactForm');
		if (form) {
			form.addEventListener('submit', function (e) {
				e.preventDefault();
				const name = document.getElementById('name').value;
				alert(`Thank you, ${name}! Your message has been sent.`);
				this.reset();
			});
		}
	}

document.addEventListener('DOMContentLoaded', function () {
	if (mainContent) showPage('home');
});
