const mainContent = document.getElementById('main-content');

function showPage(pageKey) {
	let html = '';

	switch (pageKey) {
		case 'home':
			html = `
				<h2>Featured Products</h2>
				<div class="product-grid">
					<div class="product-card">Valorant Points  750vp</div>
					<div class="product-card">Valorant Points  16500vp</div>
					<div class="product-card">Valorant Points  2500vp</div>
				</div>
			`;
			break;

		case 'about':
			html = `
				<h2>About ValTrade</h2>
				<p>ValTrade was founded in 2024 with a mission to provide cheap and reliable valorant points to fellow students and professionals alike.
				This started as a student project to bring affordable valorant points to everyone.</p>
				<h3>The Owner</h3>
				<p>Hi! I'm an IT student and the founder of this platform. I believe in clean code and quality products.</p>
                <h3>Owner Profile</h3>
                <p><strong>Name:</strong> Robert Lance I. Peñaranda</p>
                <p><strong>Role:</strong> Founder & Lead Developer</p>
                <p>As an IT student, I built this platform from the ground up to demonstrate the power of vanilla web technologies.</p>
                `;
			break;

		case 'contact':
			html = `
				<h2>Contact Us</h2>
				<form id="contactForm">
					<div class="form-group">
						<label>Name:</label><br>
						<input type="text" id="name" required>
					</div>
					<div class="form-group">
						<label>Message:</label><br>
						<textarea id="message" rows="4" required></textarea>
					</div>
					<button type="submit">Send Message</button>
				</form>
			`;
			break;

		default:
			html = `<h2>Page not found</h2>`;
	}

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
}

document.addEventListener('DOMContentLoaded', function () {
	if (mainContent) showPage('home');
});