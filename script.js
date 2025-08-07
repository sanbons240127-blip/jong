
document.addEventListener('DOMContentLoaded', function() {
    const drawButton = document.getElementById('drawButton');
    const resetButton = document.getElementById('resetButton');
    const resultContainer = document.getElementById('result');
    const numbersDisplay = document.getElementById('numbers');
    const loadingContainer = document.getElementById('loading');

    // Welcome message with SweetAlert2
    Swal.fire({
        title: '청소당번 뽑기에 오신 걸 환영합니다! 🎉',
        text: '1번부터 25번까지 중에서 랜덤으로 5명을 선택해드릴게요!',
        icon: 'info',
        confirmButtonText: '시작하기',
        confirmButtonColor: '#8b5cf6',
        background: '#ffffff',
        color: '#374151',
        showClass: {
            popup: 'animate__animated animate__bounceIn'
        },
        hideClass: {
            popup: 'animate__animated animate__bounceOut'
        }
    });

    drawButton.addEventListener('click', function() {
        // Show confirmation dialog
        Swal.fire({
            title: '청소당번을 뽑을까요?',
            text: '랜덤으로 5명이 선택됩니다.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#8b5cf6',
            cancelButtonColor: '#6b7280',
            confirmButtonText: '네, 뽑아주세요!',
            cancelButtonText: '취소',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                startDrawing();
            }
        });
    });

    resetButton.addEventListener('click', function() {
        resetResults();
    });

    function startDrawing() {
        // Hide previous results and show loading
        resultContainer.classList.add('hidden');
        loadingContainer.classList.remove('hidden');
        drawButton.disabled = true;

        // Simulate drawing process with delay
        setTimeout(() => {
            const selectedNumbers = drawNumbers();
            showResults(selectedNumbers);
            
            // Hide loading
            loadingContainer.classList.add('hidden');
            drawButton.disabled = false;
            
            // Show success message
            Swal.fire({
                title: '청소당번이 선택되었습니다! 🎯',
                html: `선택된 번호: <strong>${selectedNumbers.join(', ')}</strong>`,
                icon: 'success',
                confirmButtonText: '확인',
                confirmButtonColor: '#10b981',
                timer: 3000,
                timerProgressBar: true,
                showClass: {
                    popup: 'animate__animated animate__tada'
                }
            });
        }, 2000);
    }

    function drawNumbers() {
        // 1부터 25까지의 숫자 배열 생성
        const numbers = Array.from({ length: 25 }, (_, i) => i + 1);
        
        // Fisher-Yates 알고리즘으로 배열 섞기
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }
        
        // 처음 5개 숫자 선택하고 정렬
        return numbers.slice(0, 5).sort((a, b) => a - b);
    }

    function showResults(numbers) {
        // 이전 결과 클리어
        numbersDisplay.innerHTML = '';
        
        // 결과 컨테이너 보이기
        resultContainer.classList.remove('hidden');
        
        // 각 숫자를 카드로 표시 (지연시간을 두고)
        numbers.forEach((number, index) => {
            setTimeout(() => {
                const numberCard = document.createElement('div');
                numberCard.className = 'number-card';
                numberCard.textContent = number;
                
                // Add tooltip
                numberCard.setAttribute('data-bs-toggle', 'tooltip');
                numberCard.setAttribute('data-bs-placement', 'top');
                numberCard.setAttribute('title', `${number}번 선택됨`);
                
                numbersDisplay.appendChild(numberCard);
                
                // Initialize tooltip
                new bootstrap.Tooltip(numberCard);
                
            }, index * 300);
        });

        // Change button text
        drawButton.innerHTML = '<i class="fas fa-dice me-2"></i>다시 뽑기';
    }

    function resetResults() {
        Swal.fire({
            title: '정말 다시 뽑으시겠어요?',
            text: '현재 결과가 초기화됩니다.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: '네, 다시 뽑겠습니다',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                // Hide results with animation
                resultContainer.style.opacity = '0';
                setTimeout(() => {
                    resultContainer.classList.add('hidden');
                    resultContainer.style.opacity = '1';
                    numbersDisplay.innerHTML = '';
                    drawButton.innerHTML = '<i class="fas fa-dice me-2"></i>뽑기';
                }, 300);

                Swal.fire({
                    title: '초기화 완료!',
                    text: '새로운 청소당번을 뽑아보세요.',
                    icon: 'success',
                    confirmButtonText: '확인',
                    confirmButtonColor: '#8b5cf6',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    }

    // Add confetti effect function (can be called after successful draw)
    function createConfetti() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];
        const confettiCount = 50;

        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.top = '-10px';
                confetti.style.width = '10px';
                confetti.style.height = '10px';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.borderRadius = '50%';
                confetti.style.pointerEvents = 'none';
                confetti.style.zIndex = '9999';
                confetti.style.animation = 'fall 3s linear forwards';

                document.body.appendChild(confetti);

                setTimeout(() => {
                    confetti.remove();
                }, 3000);
            }, i * 50);
        }
    }

    // Add CSS for confetti animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            0% {
                transform: translateY(-100vh) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});
