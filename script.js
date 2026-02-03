class FlipGallery {
    constructor() {
        this.items = document.querySelectorAll('.flip-item');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.querySelector('.flip-btn.prev');
        this.nextBtn = document.querySelector('.flip-btn.next');
        this.currentSpan = document.querySelector('.current');
        this.totalSpan = document.querySelector('.total');
        
        this.currentIndex = 0;
        this.totalItems = this.items.length;
        this.isAnimating = false;
        this.autoPlayInterval = null;
        
        this.init();
    }
    
    init() {
        // 设置总页数
        this.totalSpan.textContent = this.totalItems;
        
        // 绑定事件
        this.bindEvents();
        
        // 显示第一项
        this.showItem(this.currentIndex);
        
        // 自动播放
        this.startAutoPlay();
    }
    
    bindEvents() {
        // 上一页/下一页按钮
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        
        // 点指示器
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (index !== this.currentIndex) {
                    this.showItem(index);
                }
            });
        });
        
        // 键盘控制
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
            if (e.key === ' ') this.toggleAutoPlay();
        });
        
        // 鼠标悬停暂停自动播放
        const container = document.querySelector('.flip-container');
        container.addEventListener('mouseenter', () => this.stopAutoPlay());
        container.addEventListener('mouseleave', () => this.startAutoPlay());
    }
    
    showItem(index) {
        if (this.isAnimating || index < 0 || index >= this.totalItems) return;
        
        this.isAnimating = true;
        
        // 隐藏当前项
        this.items[this.currentIndex].classList.remove('active');
        this.dots[this.currentIndex].classList.remove('active');
        
        // 显示新项
        this.currentIndex = index;
        this.items[this.currentIndex].classList.add('active');
        this.dots[this.currentIndex].classList.add('active');
        
        // 更新页码
        this.currentSpan.textContent = this.currentIndex + 1;
        
        // 动画完成后重置状态
        setTimeout(() => {
            this.isAnimating = false;
        }, 600);
    }
    
    prev() {
        let newIndex = this.currentIndex - 1;
        if (newIndex < 0) newIndex = this.totalItems - 1;
        this.showItem(newIndex);
    }
    
    next() {
        let newIndex = this.currentIndex + 1;
        if (newIndex >= this.totalItems) newIndex = 0;
        this.showItem(newIndex);
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, 4000); // 每4秒自动切换
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    toggleAutoPlay() {
        if (this.autoPlayInterval) {
            this.stopAutoPlay();
        } else {
            this.startAutoPlay();
        }
    }
}

// 页面加载后初始化
document.addEventListener('DOMContentLoaded', function() {
    // Check if gallery elements exist before initializing
    if(document.querySelector('.flip-item')) {
        const flipGallery = new FlipGallery();
        console.log('翻页相册已初始化');
    }
});

// 进入页：答对问题后进入主站（答案：2025.3.19）
document.addEventListener('DOMContentLoaded', function() {
    var entryPage = document.getElementById('entry-page');
    var mainPage = document.getElementById('main-page');
    var answerInput = document.getElementById('entry-answer');
    var submitBtn = document.getElementById('entry-submit');
    var errorMsg = document.getElementById('entry-error');
    var correctAnswer = '2025.3.19';
    var bgm = document.getElementById('entry-bgm');
    
    if (bgm) {
        bgm.play().catch(function() {
            document.addEventListener('click', function playBGM() {
                bgm.play();
                document.removeEventListener('click', playBGM);
            }, { once: true });
        });
    }

    function normalizeAnswer(val) {
        if (!val) return '';
        return String(val).trim()
            .replace(/[年\/\-]/g, '.')
            .replace(/月|日/g, '.')
            .replace(/\.+/g, '.')
            .replace(/^\.|\.$/g, '');
    }

    function checkAndEnter() {
        var userAnswer = normalizeAnswer(answerInput.value);
        if (userAnswer === correctAnswer) {
            errorMsg.classList.remove('show');
            entryPage.style.display = 'none';
            mainPage.classList.add('visible');
            if (bgm) bgm.pause();
            try { sessionStorage.setItem('lgywmy_entry_passed', '1'); } catch (e) {}
        } else {
            errorMsg.classList.add('show');
        }
    }

    if (entryPage && mainPage) {
        if (sessionStorage.getItem('lgywmy_entry_passed') === '1') {
            entryPage.style.display = 'none';
            mainPage.classList.add('visible');
        } else {
            if (submitBtn) submitBtn.addEventListener('click', checkAndEnter);
            if (answerInput) {
                answerInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') checkAndEnter();
                });
            }
        }
    }
});

// 导航高亮和滚动效果
document.addEventListener('DOMContentLoaded', function() {
    // 定义所有导航元素
    const topNavLinks = document.querySelectorAll('.nav-container a');
    const mainNavLinks = document.querySelectorAll('.media-main-nav-container a');
    const subNavLinks = document.querySelectorAll('.player-sub-nav-container a');
    const allLinks = [...topNavLinks, ...mainNavLinks, ...subNavLinks];

    // 点击导航事件
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 清除同级别导航的active
            const parentContainer = this.closest('div[class$="-container"]');
            if(parentContainer) {
                parentContainer.querySelectorAll('a').forEach(item => item.classList.remove('active'));
            }
            // 激活当前导航
            this.classList.add('active');

            // 平滑滚动
            const targetId = this.getAttribute('href');
            if(targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(targetId);
                if(target) {
                    window.scrollTo({
                        top: target.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 滚动时自动高亮导航
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('.athlete-card, .event-section, .player-column');
        const nav = document.querySelector('nav');
        const navHeight = nav ? nav.offsetHeight : 0;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // const sectionHeight = section.clientHeight; // Unused
            if(pageYOffset >= (sectionTop - navHeight - 60)) {
                current = section.getAttribute('id');
            }
        });

        if (current) {
            // 高亮顶部导航
            topNavLinks.forEach(link => {
                link.classList.remove('active');
                if(link.getAttribute('href') === `#${current}`) link.classList.add('active');
            });

            // 高亮一级媒体导航
            mainNavLinks.forEach(link => {
                link.classList.remove('active');
                if(link.getAttribute('href') === `#${current}`) link.classList.add('active');
            });

            // 高亮二级子导航
            subNavLinks.forEach(link => {
                link.classList.remove('active');
                if(link.getAttribute('href') === `#${current}`) link.classList.add('active');
            });
        }
    });
});
