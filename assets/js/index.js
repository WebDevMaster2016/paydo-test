document.addEventListener('DOMContentLoaded', function () {

	[].slice.call(document.querySelectorAll('.js-actions__link-reply')).forEach(function (element, index) {
		element.addEventListener('click', function () {
			document.querySelector('.post__reply').style.display = 'none';
			document.querySelector('.post__reply.post__reply--single').style.display = 'flex';
		});
	});

});