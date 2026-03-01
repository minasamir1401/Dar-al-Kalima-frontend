interface Book {
  title: string;
  url: string;
  image: string;
  download_url: string;
  category: string;
}

interface Course {
  id: number;
  title: string;
  instructor: string;
  lessons: string;
  duration: string;
  image: string;
  url: string;
  category: string;
  lessons_data?: { title: string, videoId: string, duration: string }[] | null;
}

class LibraryApp {
  private books: Book[] = [];
  private allBooks: Book[] = []; // Full list for filtering
  private courses: Course[] = [];
  private currentPath: string = 'home';
  private currentCategory: string | null = null;

  // DB-sourced dynamic content
  private dbPodcasts: any[] = [];
  private dbChurchVideos: any[] = [];
  private dbKidsVideos: any[] = [];

  private gridContainer: HTMLElement | null = null;
  private contentContainer: HTMLElement | null = null;

  private itemsPerPage: number = 24;
  private displayedBooksCount: number = 24;
  private displayedCoursesCount: number = 24;
  private gameScore: number = 0;
  private verses = [
    // ✝️ (1–20) آيات محبة وخلاص
    { text: "لأَنَّهُ هكَذَا أَحَبَّ اللهُ الْعَالَمَ حَتَّى بَذَلَ ابْنَهُ الْوَحِيدَ لِكَيْ لا يَهْلِكَ كُلُّ مَنْ يُؤْمِنُ بِهِ بَلْ تَكُونُ لَهُ الْحَيَاةُ الأَبَدِيَّةُ.", reference: "يو 3:16" },
    { text: "اللهُ مَحَبَّةٌ، وَمَنْ يَثْبُتْ فِي الْمَحَبَّةِ يَثْبُتْ فِي اللهِ وَاللهُ فِيهِ.", reference: "1يو 4:16" },
    { text: "أَنَا هُوَ الطَّرِيقُ وَالْحَقُّ وَالْحَيَاةُ. لَيْسَ أَحَدٌ يَأْتِي إِلَى الآبِ إِلاَّ بِي.", reference: "يو 14:6" },
    { text: "لأَنَّ ابْنَ الإِنْسَانِ قَدْ جَاءَ لِكَيْ يَطْلُبَ وَيُخَلِّصَ مَا قَدْ هَلَكَ.", reference: "لو 19:10" },
    { text: "هذَا هُوَ الْوَصِيَّةُ أَنْ نُؤْمِنَ بِاسْمِ ابْنِهِ يَسُوعَ الْمَسِيحِ وَنُحِبَّ بَعْضُنَا بَعْضًا.", reference: "1يو 3:23" },
    { text: "لأَنَّ اللهَ لَمْ يُرْسِلِ ابْنَهُ إِلَى الْعَالَمِ لِيَدِينَ الْعَالَمَ بَلْ لِيَخْلُصَ بِهِ الْعَالَمُ.", reference: "يو 3:17" },
    { text: "هكَذَا أَضَاءَ نُورُكُمْ قُدَّامَ النَّاسِ لِكَيْ يَرَوْا أَعْمَالَكُمُ الْحَسَنَةَ وَيُمَجِّدُوا أَبَاكُمُ الَّذِي فِي السَّمَاوَاتِ.", reference: "مت 5:16" },
    { text: "مَنْ يُقْبِلْ إِلَيَّ فَلاَ أُخْرِجُهُ خَارِجًا.", reference: "يو 6:37" },
    { text: "أَمَّا الرَّبُّ فَإِنَّهُ أَمِينٌ، الَّذِي سَيُثَبِّتُكُمْ وَيَحْفَظُكُمْ مِنَ الشِّرِّيرِ.", reference: "2تس 3:3" },
    { text: "أَنَا هُوَ الرَّاعِي الصَّالِحُ، وَالرَّاعِي الصَّالِحُ يَبْذِلُ نَفْسَهُ عَنِ الْخِرَافِ.", reference: "يو 10:11" },

    // 🕊️ (21–40) آيات سلام وتشجيع
    { text: "لاَ تَخَفْ لأَنِّي مَعَكَ. لاَ تَتَلَفَّتْ لأَنِّي إِلَهُكَ. قَدْ أَيَّدْتُكَ وَأَعَنْتُكَ.", reference: "إش 41:10" },
    { text: "الرَّبُّ رَاعِيَّ فَلاَ يُعْوِزُنِي شَيْءٌ. فِي مَرَاعٍ خُضْرٍ يُرْبِضُنِي.", reference: "مز 23:1–2" },
    { text: "سَلاَمًا أَتْرُكُ لَكُمْ. سَلاَمِي أُعْطِيكُمْ. لاَ تَضْطَرِبْ قُلُوبُكُمْ.", reference: "يو 14:27" },
    { text: "تَوَكَّلْ عَلَى الرَّبِّ بِكُلِّ قَلْبِكَ وَعَلَى فَهْمِكَ لاَ تَعْتَمِدْ.", reference: "أم 3:5" },
    { text: "الرَّبُّ نُورِي وَخَلاَصِي فَمِمَّنْ أَخَافُ.", reference: "مز 27:1" },
    { text: "كُلَّ شَيْءٍ أَسْتَطِيعُ فِي الْمَسِيحِ الَّذِي يُقَوِّينِي.", reference: "في 4:13" },
    { text: "أَلْقُوا عَلَيْهِ كُلَّ هَمِّكُمْ لأَنَّهُ هُوَ يَعْتَنِي بِكُمْ.", reference: "1بط 5:7" },
    { text: "الرَّبُّ قَرِيبٌ مِنَ الْمُنْكَسِرِي الْقُلُوبِ.", reference: "مز 34:18" },
    { text: "طُوبَى لِصَانِعِي السَّلاَمِ لأَنَّهُمْ أَبْنَاءَ اللهِ يُدْعَوْنَ.", reference: "مت 5:9" },
    { text: "الرَّبُّ مَعِي فَلاَ أَخَافُ.", reference: "مز 118:6" },

    // 📘 (41–60) آيات سلوك وتعليم
    { text: "أَحِبُّوا بَعْضُكُمْ بَعْضًا كَمَا أَحْبَبْتُكُمْ أَنَا.", reference: "يو 13:34" },
    { text: "كُونُوا لُطَفَاءَ بَعْضُكُمْ نَحْوَ بَعْضٍ، شَفُوقِينَ مُتَسَامِحِينَ.", reference: "أف 4:32" },
    { text: "افرحوا في الرب كل حين وأقول أيضًا افرحوا.", reference: "في 4:4" },
    { text: "كُلُّ مَا تُرِيدُونَ أَنْ يَفْعَلَ النَّاسُ بِكُمُ افْعَلُوا هكَذَا أَنْتُمْ أَيْضًا بِهِمْ.", reference: "مت 7:12" },
    { text: "ثِمَارُ الرُّوحِ هِيَ مَحَبَّةٌ فَرَحٌ سَلاَمٌ.", reference: "غل 5:22" },
    { text: "كُونُوا قُدِّيسِينَ لأَنِّي أَنَا قُدُّوسٌ.", reference: "1بط 1:16" },
    { text: "مَنْ يَزْرَعْ بِالْبَرَكَاتِ فَبِالْبَرَكَاتِ أَيْضًا يَحْصُدُ.", reference: "2كو 9:6" },
    { text: "لاَ تَغْلِبَنَّكَ الشَّرُّ بَلِ اغْلِبِ الشَّرَّ بِالْخَيْرِ.", reference: "رو 12:21" },
    { text: "كُونُوا سَامِعِينَ لِلْكَلِمَةِ لاَ سَامِعِينَ فَقَطْ.", reference: "يع 1:22" },
    { text: "طُوبَى لِلْأَنْقِيَاءِ الْقَلْبِ لأَنَّهُمْ يُعَايِنُونَ اللهَ.", reference: "مت 5:8" },

    // 👶 (61–80) آيات مناسبة للأطفال
    { text: "دَعُوا الأَوْلاَدَ يَأْتُونَ إِلَيَّ وَلاَ تَمْنَعُوهُمْ.", reference: "مر 10:14" },
    { text: "الرَّبُّ يُحِبُّ الْبَارَّ.", reference: "مز 146:8" },
    { text: "اللهُ مَعَنَا مَلْجَأٌ وَقُوَّةٌ.", reference: "مز 46:1" },
    { text: "يَسُوعُ الْمَسِيحُ هُوَ هُوَ أَمْسًا وَالْيَوْمَ وَإِلى الأَبَدِ.", reference: "عب 13:8" },
    { text: "الرَّبُّ صَخْرَتِي وَحِصْنِي وَمُنْقِذِي.", reference: "مز 18:2" },
    { text: "الرَّبُّ يَحْفَظُ خُرُوجَكَ وَدُخُولَكَ.", reference: "مز 121:8" },
    { text: "الرَّبُّ صَالِحٌ لِلْكُلِّ.", reference: "مز 145:9" },
    { text: "الرَّبُّ يُرْشِدُ الْوُدَعَ فِي الْحَقِّ.", reference: "مز 25:9" },
    { text: "الرَّبُّ نَصِيرُ الْمَسَاكِينِ.", reference: "مز 140:12" },
    { text: "اسْأَلُوا تُعْطَوْا. اطْلُبُوا تَجِدُوا.", reference: "مت 7:7" },

    // 🌟 (81–100) آيات إيمان وثبات
    { text: "الرَّبُّ أَمِينٌ فِي كُلِّ أَقْوَالِهِ.", reference: "مز 145:13" },
    { text: "مَعَ اللهِ نَصْنَعُ بِبَأْسٍ.", reference: "مز 60:12" },
    { text: "الرَّبُّ حِصْنُ حَيَاتِي.", reference: "مز 27:1" },
    { text: "الرَّبُّ يُعْطِي حِكْمَةً.", reference: "أم 2:6" },
    { text: "الرَّبُّ يَقُودُنِي فِي سُبُلِ الْبِرِّ.", reference: "مز 23:3" },
    { text: "الرَّبُّ يُعِينُ جَمِيعَ السَّاقِطِينَ.", reference: "مز 145:14" },
    { text: "اللهُ أَمِينٌ الَّذِي لاَ يَدَعُكُمْ تُجَرَّبُونَ فَوْقَ مَا تَسْتَطِيعُونَ.", reference: "1كو 10:13" },
    { text: "الرَّبُّ صَالِحٌ وَمُسْتَقِيمٌ.", reference: "مز 25:8" },
    { text: "مَنْ يَثِقْ بِالرَّبِّ فَهُوَ فِي أَمَانٍ.", reference: "أم 29:25" },
    { text: "الرَّبُّ مَلِكٌ إِلَى الدَّهْرِ.", reference: "مز 10:16" },
    { text: "كَلِمَتُكَ مِصْبَاحٌ لِرِجْلِي.", reference: "مز 119:105" },
    { text: "الرَّبُّ يُبَارِكُ شَعْبَهُ بِالسَّلاَمِ.", reference: "مز 29:11" },
    { text: "الرَّبُّ يُحِبُّ الصِّدِّيقِينَ.", reference: "مز 146:8" },
    { text: "الرَّبُّ قَرِيبٌ لِكُلِّ الَّذِينَ يَدْعُونَهُ.", reference: "مز 145:18" },
    { text: "اللهُ مَعَنَا فَمَنْ عَلَيْنَا.", reference: "رو 8:31" },
    { text: "الرَّبُّ نَاصِرُ الْمَظْلُومِينَ.", reference: "مز 146:7" },
    { text: "الرَّبُّ يَمْلِكُ فَلْتَبْتَهِجِ الأَرْضُ.", reference: "مز 97:1" },
    { text: "أَنَا مَعَكُمْ كُلَّ الأَيَّامِ إِلَى انْقِضَاءِ الدَّهرِ.", reference: "مت 28:20" },
    { text: "الرَّبُّ صَالِحٌ حِصْنٌ فِي يَوْمِ الضِّيقِ.", reference: "نا 1:7" },
    { text: "نِعْمَةُ الرَّبِّ يَسُوعَ الْمَسِيحِ وَمَحَبَّةُ اللهِ مَعَ جَمِيعِكُمْ.", reference: "2كو 13:14" }
  ];

  private kidsSections: { title: string, icon: string, color: string, videos: { title: string, id: string }[] }[] = [
    {
      title: 'قصص الكتاب المقدس المصورة',
      icon: 'fa-book-bible',
      color: '#4caf50',
      videos: [
        { title: 'آدم وحواء وبداية الخليقة', id: 'R2qW0MJlbEI' },
        { title: 'قايين وهابيل', id: 'i_15QL9gr4k' },
        { title: 'فلك نوح بالطوفان', id: 's8YQNIJ0tOI' },
        { title: 'إبراهيم أبو الآباء ج1', id: '5taN_nxEBxQ' },
        { title: 'إبراهيم أبو الآباء ج2', id: 'LBndqPUDD1Y' },
        { title: 'إبراهيم أبو الآباء ج3', id: 'RbdvcoL6mM8' },
        { title: 'إسحق ورفقة وإليعازر', id: 'maGqLCNna1I' },
        { title: 'قصة أبونا إسحق', id: 'j99239YwVLE' },
        { title: 'يعقوب وعيسو وسرقة البكورية', id: 'XEpDlmIz8wE' },
        { title: 'يعقوب ولابان وراحيل وليئة', id: '-9EnS2-zItY' },
        { title: 'يوسف البار الجزء الأول', id: 'SJh4Mzy9eWs' },
        { title: 'يوسف البار الجزء الثاني', id: 'p9_fbI5w78Y' },
        { title: 'يوسف البار الجزء الثالث', id: 'NO2HrV9W_X0' },
        { title: 'يوسف البار الجزء الرابع', id: 'XB8GroSOVnQ' },
        { title: 'يوسف البار الجزء الخامس', id: '8dkn9ttBzwY' },
        { title: 'داود وجليات الجبار', id: 'V-7KjSTUos8' },
        { title: 'دانيال والثلاثة فتية ج1', id: 'A8Iy7kuWeUA' },
        { title: 'الثلاثة فتية في أتون النار', id: 'PxoTqaXXOow' },
        { title: 'دانيال وحلم نبوخذ نصر', id: 'eVSdOZ9T_ZI' },
        { title: 'يونان النبي والحوت', id: 'Zq3r8FcqL2A' },
        { title: 'البشارة وميلاد السيد المسيح', id: 'v-NU3KQL-MM' },
        { title: 'زكريا وأليصابات ويوحنا', id: 'WuEZsF1xr24' },
        { title: 'قصة المرأة السامرية', id: '7FwucHOtrTU' },
        { title: 'الابن الضال والخروف الضال', id: 'VED1O-La-xA' },
        { title: 'قيامة السيد المسيح', id: 'ySS8pYVTQsY' },
        { title: 'دانيال في جب الأسود', id: 'j4n9NsUh_nw' },
        { title: 'بال والتنين - دانيال ج6', id: 'KlqK8WyvqvA' }
      ]
    },
    {
      title: 'خلوة بودكاست - مينا ياسر',
      icon: 'fa-feather-pointed',
      color: '#2196f3',
      videos: [
        { title: 'شرح سفر نحميا في ١٠ دقائق', id: 'bYaiBysbmdg' },
        { title: 'شرح سفر راعوث في ٦ دقائق', id: 'FuLTNtaxx-I' },
        { title: 'شرح سفر إستير في ١٠ دقائق', id: 'iWWH08kl8mQ' },
        { title: 'شرح سفر المكابيين في ١٠ دقائق', id: '6LxJm4pgr-M' },
        { title: 'شرح سفر باروخ في ١٠ دقائق', id: 'syXyRgVFjnI' },
        { title: 'شرح سفر أعمال الرسل في ١٠ دقائق', id: '5MBoGvSsf9E' },
        { title: 'شرح سفر ناحوم في ١٠ دقائق', id: 'jNN0FoFeh8A' },
        { title: 'شرح سفر مراثي إرميا في ١٠ دقائق', id: 'y6mMhE3U0BY' },
        { title: 'شرح سفر أيوب في ١٠ دقائق', id: 'AIP_eb53fUc' },
        { title: 'شرح سفر القضاة في ١٠ دقائق', id: 'mt2Fzg7NUKI' },
        { title: 'شرح سفر يونان في ٨ دقائق', id: 'gXnF8A9X1iY' },
        { title: 'شرح سفر يهوديت في ١٥ دقيقة', id: 'K4tmVckRmKI' },
        { title: 'شرح سفر دانيال في ١٥ دقيقة', id: 'xKqabvpAZNU' },
        { title: 'شرح سفر طوبيا في ١٠ دقائق', id: 'Sagr6_NIVuY' },
        { title: 'شرح سفر نشيد الأنشاد في ٧ دقائق', id: '2pTZ-jy9sms' },
        { title: 'شرح سفر الرؤيا في ١٠ دقائق', id: 'qmoYiviML5Q' }
      ]
    },
    {
      title: 'كارتون كنسي',
      icon: 'fa-clapperboard',
      color: '#ff4b82',
      videos: [
        { title: 'برنامج سمسم ومنصور - قصص الأنبياء', id: 'mD2I3E83jX0' },
        { title: 'قصة الميلاد للطفل يسوع', id: '2h0XvE7V4oQ' },
        { title: 'يوسف الصديق للأطفال', id: 'L-6Z-M8v3xU' },
        { title: 'داود وجوليات الكارتون', id: 'O7zW5eM8wU8' }
      ]
    },
    {
      title: 'ترانيم وأغاني الأطفال',
      icon: 'fa-music',
      color: '#ffc107',
      videos: [
        { title: 'ترنيمة جدو صموئيل - كوجي', id: '5EwA-oD3wUo' },
        { title: 'ترنيمة السامري الصالح', id: 'rL9_M7M3wU8' },
        { title: 'أنا المسيحي الصغير', id: 'u3E2W4w3xUo' }
      ]
    }
  ];


  constructor() {
    this.init();
  }

  async init() {
    this.gridContainer = document.getElementById('book-grid');
    this.contentContainer = document.getElementById('content-container');

    this.contentContainer = document.getElementById('content-container');
    const API_BASE = 'https://dar-al-kalima-backend-production.up.railway.app/api';

    try {
      console.log(`Attempting to fetch data from ${API_BASE}`);
      const [bRes, cRes, podRes, cvRes, kidsRes] = await Promise.all([
        fetch(`${API_BASE}/books`).catch(err => { throw new Error(`Books API failed: ${err.message}`) }),
        fetch(`${API_BASE}/courses`).catch(err => { throw new Error(`Courses API failed: ${err.message}`) }),
        fetch(`${API_BASE}/podcasts`).catch(() => new Response('[]', { status: 200 })),
        fetch(`${API_BASE}/church-videos`).catch(() => new Response('[]', { status: 200 })),
        fetch(`${API_BASE}/kids-videos`).catch(() => new Response('[]', { status: 200 }))
      ]);

      if (!bRes.ok || !cRes.ok) throw new Error("Backend response not OK");

      this.allBooks = await bRes.json();
      this.books = [...this.allBooks];
      this.courses = await cRes.json();
      this.dbPodcasts = podRes.ok ? await podRes.json() : [];
      this.dbChurchVideos = cvRes.ok ? await cvRes.json() : [];
      this.dbKidsVideos = kidsRes.ok ? await kidsRes.json() : [];

      this.updateStats();
      this.renderCategories();
      console.log(`System: ${this.books.length} Books, ${this.courses.length} Courses active.`);
    } catch (e: any) {
      console.error("Connection error:", e.message);
      if (this.contentContainer) {
        this.contentContainer.innerHTML = `
          <div class="glass p-8 text-center" style="border: 2px solid #ff4d4d; background: rgba(255, 77, 77, 0.1);">
            <i class="fa-solid fa-triangle-exclamation text-4xl mb-4" style="color: #ff4d4d;"></i>
            <h2 class="text-xl font-bold mb-2">فشل الاتصال بمركز البيانات</h2>
            <p class="text-muted mb-4">تعذر الوصول إلى: ${API_BASE}</p>
            <p class="text-xs text-muted mb-4">الخطأ: ${e.message}</p>
            <button class="btn btn-primary mt-4" onclick="location.reload()">إعادة المحاولة</button>
          </div>
        `;
        return;
      }
    }

    this.setupRoutes();
    this.setupSearch();
    this.renderHome();
  }

  updateStats() {
    const bSpan = document.getElementById('stat-books');
    const cSpan = document.getElementById('stat-courses');
    const tSpan = document.getElementById('total-books-count');

    if (bSpan) bSpan.innerText = this.allBooks.length.toLocaleString();
    if (cSpan) cSpan.innerText = this.courses.length.toLocaleString();
    if (tSpan) tSpan.innerText = `${this.allBooks.length} كتاب متاح`;
  }

  renderCategories() {
    // Previous sidebar category logic removed per user request.
  }

  filterByCategory(cat: string | null) {
    this.currentCategory = cat;
    if (this.currentPath === 'courses') {
      this.displayedCoursesCount = this.itemsPerPage;
      this.renderCourses();
    } else {
      this.displayedBooksCount = this.itemsPerPage;
      if (this.currentPath !== 'books') {
        this.navigate('books');
      } else {
        this.renderBooks();
      }
    }
    // Category list removed from sidebar
  }

  setupRoutes() {
    const menuToggle = document.getElementById('menu-toggle');
    const topMenu = document.querySelector('.top-menu');

    menuToggle?.addEventListener('click', () => {
      topMenu?.classList.toggle('open');
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    document.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = (e.currentTarget as HTMLElement).dataset.page || 'home';
        this.navigate(page);

        document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
        (e.currentTarget as HTMLElement).classList.add('active');

        // Close menu on mobile after selection
        if (window.innerWidth <= 1024) {
          topMenu?.classList.remove('open');
          const icon = menuToggle?.querySelector('i');
          if (icon) {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-xmark');
          }
        }
      });
    });
  }

  navigate(page: string) {
    this.currentPath = page;
    this.currentCategory = null; // Reset category on page switch
    this.displayedBooksCount = this.itemsPerPage;
    this.displayedCoursesCount = this.itemsPerPage;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (page === 'home') this.renderHome();
    else if (page === 'books') this.renderBooks();
    else if (page === 'courses') this.renderCourses();
    else if (page === 'church-videos') this.renderChurchVideos();
    else if (page === 'podcast') this.renderPodcast();
    else if (page === 'kids') this.renderKids();
    else this.renderAbout();

    this.renderCategories(); // Update sidebar categories
  }

  renderHome() {
    if (!this.contentContainer) return;

    // Latest items
    const latestBooks = this.books.slice(0, 4);
    const latestCourses = this.courses.slice(0, 4);

    this.contentContainer.innerHTML = `
      <div class="hero glass fade-in mb-12">
        <div class="hero-content">
           <span class="badge" style="background: rgba(33, 150, 243, 0.1); color: #2196f3;">مرحباً بك في دار الكلمة</span>
           <h1>اكتشف كنوز الحكمة والروحانية</h1>
           <p class="text-muted mb-8">منصتكم الشاملة للكتب المسيحية، الكورسات التعليمية، وفيديوهات الكنيسة والبودكاست. كل ما تحتاجه للنمو الروحي والمعرفي في مكان واحد.</p>
           <div class="flex flex-wrap gap-4">
             <button class="btn btn-primary" onclick="app.navigate('books')">تصفح الكتب</button>
             <button class="btn glass" onclick="app.navigate('courses')">الكورسات</button>
             <button class="btn glass" style="background: rgba(255, 193, 7, 0.1); border-color: #ffc107; color: #ffc107;" onclick="app.navigate('kids')">ركن الأطفال 🎈</button>
           </div>
        </div>
        <div class="hero-img">
           <i class="fa-solid fa-book-open-reader fa-10x opacity-10"></i>
        </div>
      </div>

      <!-- Books Highlights -->
      <div class="section-header">
        <div class="section-title">
          <i class="fa-solid fa-star text-primary"></i>
          <h2>أحدث الكتب المضافة</h2>
        </div>
        <a href="#" onclick="app.navigate('books')" class="view-all">عرض الكل <i class="fa-solid fa-arrow-left"></i></a>
      </div>
      <div class="book-grid mb-12">
        ${latestBooks.map(book => `
          <div class="book-card glass" onclick="app.viewBook('${book.url}')" style="cursor: pointer;">
            <img src="${book.image}" alt="${book.title}" class="book-img" loading="lazy">
            <div class="book-info">
              <div class="book-title text-sm">${book.title}</div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Courses Highlights -->
      <div class="section-header">
        <div class="section-title">
          <i class="fa-solid fa-graduation-cap text-secondary"></i>
          <h2>كورسات مقترحة</h2>
        </div>
        <a href="#" onclick="app.navigate('courses')" class="view-all">عرض الكل <i class="fa-solid fa-arrow-left"></i></a>
      </div>
      <div class="book-grid mb-12">
        ${latestCourses.map(course => `
          <div class="book-card glass" onclick="app.renderPlayer(${JSON.stringify(course).replace(/"/g, '&quot;')})" style="cursor: pointer;">
            <img src="${course.image}" alt="${course.title}" class="book-img" loading="lazy">
            <div class="book-info">
              <div class="book-title text-sm text-center">${course.title}</div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <!-- Church Media Section -->
        <div class="media-section-card p-8 rounded-[32px]">
          <div class="section-header mb-8">
            <div class="section-title">
              <div class="play-icon-wrapper" style="background: var(--primary); color: #fff;">
                <i class="fa-solid fa-clapperboard"></i>
              </div>
              <h2 class="text-2xl">ميديا كنسية</h2>
            </div>
            <a href="#" onclick="app.navigate('church-videos')" class="view-all">كل الفيديوهات <i class="fa-solid fa-chevron-left text-xs"></i></a>
          </div>
          
          <div class="grid gap-4">
             <div class="media-item flex gap-4 items-center p-4 rounded-2xl cursor-pointer" onclick="app.playChurchVideo('zld51r43YyU', 'لحن ابؤرو الفرايحى')">
                <div class="relative flex-shrink-0">
                  <img src="https://img.youtube.com/vi/zld51r43YyU/mqdefault.jpg" class="media-thumb">
                  <div class="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <i class="fa-solid fa-play text-white text-xl"></i>
                  </div>
                </div>
                <div class="media-content">
                  <div class="media-title">إبؤرو الفرايحى</div>
                  <div class="media-subtitle">المعلم ابراهيم عياد - ألحان الكنيسة</div>
                </div>
             </div>

             <div class="media-item flex gap-4 items-center p-4 rounded-2xl cursor-pointer" onclick="app.playChurchVideo('ImMBzlYYqFQ', 'فتشوا الكتب - الحلقة الأولى')">
                <div class="relative flex-shrink-0">
                  <img src="https://img.youtube.com/vi/ImMBzlYYqFQ/mqdefault.jpg" class="media-thumb">
                </div>
                <div class="media-content">
                  <div class="media-title">فتشوا الكتب - الحلقة ١</div>
                  <div class="media-subtitle">دراسة في الكتاب المقدس - تعليمي</div>
                </div>
             </div>

             <div class="media-item flex gap-4 items-center p-4 rounded-2xl cursor-pointer" onclick="app.playChurchVideo('PcS-9LS0XZI', 'ترنيمة امسك يا رب ايدي')">
                <div class="relative flex-shrink-0">
                  <img src="https://img.youtube.com/vi/PcS-9LS0XZI/mqdefault.jpg" class="media-thumb">
                </div>
                <div class="media-content">
                  <div class="media-title">ترنيمة امسك يا رب ايدي</div>
                  <div class="media-subtitle">كورال قلب داود - ترانيم روحية</div>
                </div>
             </div>
          </div>
        </div>

        <!-- Podcasts Section -->
        <div class="media-section-card p-8 rounded-[32px]">
          <div class="section-header mb-8">
            <div class="section-title">
              <div class="play-icon-wrapper" style="background: var(--secondary); color: #000;">
                <i class="fa-solid fa-microphone"></i>
              </div>
              <h2 class="text-2xl">بودكاست الروح</h2>
            </div>
            <a href="#" onclick="app.navigate('podcast')" class="view-all">كل الحلقات <i class="fa-solid fa-chevron-left text-xs"></i></a>
          </div>

          <div class="grid gap-4">
             <div class="media-item podcast-item flex gap-5 items-center p-5 rounded-2xl cursor-pointer" onclick="app.playPodcastEpisode('kY2IUPk4HDo', 'الخوف عدو أم صديق (٥)')">
                <div class="play-icon-wrapper">
                   <i class="fa-solid fa-play"></i>
                </div>
                <div class="media-content">
                  <div class="media-title">الخوف عدو أم صديق (٥)</div>
                  <div class="media-subtitle">أبونا سارافيم البرموسي - بودكاست</div>
                </div>
             </div>

             <div class="media-item podcast-item flex gap-5 items-center p-5 rounded-2xl cursor-pointer" onclick="app.playPodcastEpisode('cTqNhBLkYEE', 'إيه دور النعمة في حياتنا؟ (٣)')">
                <div class="play-icon-wrapper">
                   <i class="fa-solid fa-play"></i>
                </div>
                <div class="media-content">
                  <div class="media-title">إيه دور النعمة في حياتنا؟ (٣)</div>
                  <div class="media-subtitle">أبونا سارافيم البرموسي - بودكاست</div>
                </div>
             </div>

             <div class="media-item podcast-item flex gap-5 items-center p-5 rounded-2xl cursor-pointer" onclick="app.playPodcastEpisode('ZAYF9AY8r3k', 'إن جيت للحق - الحلقة الأولى')">
                <div class="play-icon-wrapper">
                   <i class="fa-solid fa-play"></i>
                </div>
                <div class="media-content">
                  <div class="media-title">إن جيت للحق - ح١</div>
                  <div class="media-subtitle">حلقات اجتماعية وروحية هادفة</div>
                </div>
             </div>
          </div>
        </div>
      </div>
    `;
  }

  renderBooks() {
    const booksToDisplay = this.currentCategory
      ? this.allBooks.filter(b => b.category === this.currentCategory)
      : this.allBooks;

    const allCategories = [...new Set(this.allBooks.map(b => b.category))].filter(Boolean);

    const categoryTabsHTML = `
      <div class="book-categories-scroll mb-8 fade-in">
        <button class="btn-cat ${!this.currentCategory ? 'active' : ''}" onclick="app.filterByCategory(null)">الكل</button>
        ${allCategories.map(c => `
          <button class="btn-cat ${this.currentCategory === c ? 'active' : ''}" onclick="app.filterByCategory('${c}')">
            ${c}
          </button>
        `).join('')}
      </div>
    `;

    this.contentContainer!.innerHTML = `
      <div class="section-header">
        <div class="section-title">
          <i class="fa-solid fa-book"></i>
          <h2>${this.currentCategory || 'تصفح الكتب'} (${booksToDisplay.length})</h2>
        </div>
        ${this.currentCategory ? `<button class="btn glass btn-sm" style="background: rgba(33, 150, 243, 0.2); color: #2196f3; border-color: #2196f3;" onclick="app.filterByCategory(null)">إلغاء التصفية <i class="fa-solid fa-xmark"></i></button>` : ''}
      </div>

      ${categoryTabsHTML}

      <div class="book-grid" id="book-grid"></div>
      <div id="load-more-container" class="mt-8 text-center"></div>
    `;
    this.gridContainer = document.getElementById('book-grid');
    this.displayItems(booksToDisplay.slice(0, this.displayedBooksCount));
    this.updateLoadMore('books', booksToDisplay.length);
  }

  renderCourses() {
    const coursesToDisplay = this.currentCategory
      ? this.courses.filter(c => c.category === this.currentCategory)
      : this.courses;

    const categoryHTML = `
      <div id="categoriesContainer" class="categories-grid mb-8 fade-in">
        ${[
        { name: 'برمجة', icon: 'fa-code', color: '#1a73e8' },
        { name: 'انجليزي', icon: 'fa-language', color: '#fbbc04' },
        { name: 'تكنولوجيا المعلومات', icon: 'fa-microchip', color: '#34a853' },
        { name: 'جرافيك ديزاين', icon: 'fa-palette', color: '#ea4335' },
        { name: 'الهندسة', icon: 'fa-compass-drafting', color: '#673ab7' },
        { name: 'الادارة و التجارة', icon: 'fa-briefcase', color: '#607d8b' },
        { name: 'الطب', icon: 'fa-stethoscope', color: '#e91e63' },
        { name: 'فنون', icon: 'fa-paintbrush', color: '#ff9800' },
        { name: 'الثانوية العامة', icon: 'fa-school', color: '#795548' },
        { name: 'اللغات', icon: 'fa-comments', color: '#00bcd4' },
        { name: 'تسويق', icon: 'fa-bullhorn', color: '#4caf50' },
        { name: 'أعمال يدوية', icon: 'fa-hands', color: '#9c27b0' }
      ].map(cat => `
          <div class="cat-card glass" onclick="app.filterByCategory('${cat.name}')" style="--accent: ${cat.color}">
            <i class="fa-solid ${cat.icon} cat-icon"></i>
            <span>${cat.name}</span>
          </div>
        `).join('')}
      </div>
    `;

    this.contentContainer!.innerHTML = `
      <div class="section-header">
        <div class="section-title">
          <i class="fa-solid fa-graduation-cap"></i>
          <h2>${this.currentCategory || 'جميع الكورسات'} (${coursesToDisplay.length})</h2>
        </div>
        ${this.currentCategory ? `<button class="btn glass btn-sm" style="background: rgba(33, 150, 243, 0.2); color: #2196f3; border-color: #2196f3;" onclick="app.filterByCategory(null)">عرض الكل <i class="fa-solid fa-xmark"></i></button>` : ''}
      </div>
      
      ${!this.currentCategory ? categoryHTML : ''}

      <div class="book-grid" id="book-grid"></div>
      <div id="load-more-container" class="mt-8 text-center"></div>
    `;
    this.gridContainer = document.getElementById('book-grid');
    this.displayCourses(coursesToDisplay.slice(0, this.displayedCoursesCount));
    this.updateLoadMore('courses', coursesToDisplay.length);
  }

  displayItems(items: Book[]) {
    if (!this.gridContainer) return;
    this.gridContainer.innerHTML = items.map(book => `
      <div class="book-card glass fade-in" onclick="app.viewBook('${book.url}')" style="cursor: pointer;">
        <div class="book-tag">${book.category || 'عام'}</div>
        <img src="${book.image}" alt="${book.title}" class="book-img" loading="lazy" onerror="this.src='https://via.placeholder.com/300x400?text=Book'">
        <div class="book-info">
          <div class="book-title" title="${book.title}">${book.title}</div>
          <div class="book-actions">
            <button class="btn btn-primary btn-sm w-full" onclick="event.stopPropagation(); app.viewBook('${book.url}')">
              التفاصيل والتحميل
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  viewBook(url: string) {
    const book = this.allBooks.find(b => b.url === url);
    if (!book) return;

    this.currentPath = 'book-details';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.contentContainer!.innerHTML = `
      <button class="btn glass mb-6" style="background: rgba(33, 150, 243, 0.2); color: #2196f3; border-color: #2196f3;" onclick="app.navigate('books')">
        <i class="fa-solid fa-arrow-right"></i> العودة للكتب
      </button>
      <div class="glass p-8 rounded-[28px] fade-in">
        <div class="flex flex-col md:flex-row gap-8">
          <div class="w-full md:w-1/3 lg:w-1/4">
             <img src="${book.image}" alt="${book.title}" class="w-full rounded-[20px] shadow-lg mb-4" onerror="this.src='https://via.placeholder.com/300x400?text=Book'">
             <div class="book-tag secondary static-important text-center mb-4">${book.category || 'عام'}</div>
          </div>
          <div class="w-full md:w-2/3 lg:w-3/4">
             <h1 class="text-3xl font-bold mb-4">${book.title}</h1>
             <p class="text-muted mb-6">هذا الكتاب متوفر الآن للتحميل المجاني. نرجو أن يكون سبب بركة ومنفعة لحياتك الروحية. تم فهرسة هذا الكتاب ضمن قسم ${book.category || 'عام'}.</p>
             
             <div class="flex flex-col sm:flex-row gap-4 mt-8">
               <button class="btn btn-primary" onclick="window.open('https://dar-al-kalima-backend-production.up.railway.app/api/download?url=' + encodeURIComponent('${book.download_url || book.url}'), '_blank')">
                 <i class="fa-solid fa-download"></i> تحميل الكتاب من المنارة
               </button>
                <button class="btn glass" style="background: rgba(33, 150, 243, 0.2); color: #2196f3; border-color: #2196f3;" onclick="app.shareBook('${book.title.replace(/'/g, "\\'")}')">
                  <i class="fa-solid fa-share-nodes"></i> مشاركة الكتاب
                </button>
             </div>
             
             <div class="mt-8 p-4 bg-glass-light rounded-2xl">
                <h3 class="font-bold mb-2 flex items-center gap-2"><i class="fa-solid fa-circle-info text-primary"></i> معلومات الملف</h3>
                <ul class="text-sm text-muted list-inside list-disc">
                   <li>المصدر: المكتبة المسيحية الشاملة</li>
                   <li>التصنيف: ${book.category}</li>
                   <li>الصيغة: PDF عادةً</li>
                </ul>
             </div>
          </div>
        </div>
      </div>
    `;
  }

  displayCourses(courses: Course[]) {
    if (!this.gridContainer) return;
    this.gridContainer.innerHTML = courses.map(course => `
      <div class="book-card glass fade-in" onclick="app.viewCourse(${course.id})" style="cursor: pointer;">
        <div class="book-tag secondary">${course.category}</div>
        <img src="${course.image}" alt="${course.title}" class="book-img" loading="lazy">
        <div class="book-info">
          <div class="book-title" title="${course.title}">${course.title}</div>
          <div class="instructor"><i class="fa-solid fa-user-tie"></i> ${course.instructor}</div>
          <div class="lesson-count"><i class="fa-solid fa-play"></i> ${course.lessons}</div>
          <div class="book-actions mt-2">
            <button class="btn btn-primary btn-sm w-full" onclick="event.stopPropagation(); app.viewCourse(${course.id})">
               ابدأ التعلم <i class="fa-solid fa-play ml-1"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  async viewCourse(id: number) {
    this.currentPath = 'course-player';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    const API_BASE = 'https://dar-al-kalima-backend-production.up.railway.app/api';

    // 1. Show Loading State
    this.contentContainer!.innerHTML = `
      <div class="loading-overlay fade-in">
        <div class="spinner"></div>
        <h2>جاري تحضير محتوى الكورس...</h2>
        <p class="text-muted">نحن نجهز لك قائمة الفيديوهات من المصدر</p>
      </div>
    `;

    try {
      // 2. Fetch Course Extras
      const res = await fetch(`${API_BASE}/courses/${id}`);
      const course: Course = await res.json();

      // 3. If no lessons_data, start scraping
      if (!course.lessons_data) {
        this.contentContainer!.innerHTML = `
          <div class="loading-overlay fade-in">
            <div class="spinner"></div>
            <h2>بدء استخراج الدروس لأول مرة...</h2>
            <p class="text-muted italic">قد يستغرق هذا دقيقة واحدة، يرجى الانتظار لنقوم بحفظ الدروس لك.</p>
          </div>
        `;
        const scrapeRes = await fetch(`${API_BASE}/courses/${id}/scrape`);
        const scrapeData = await scrapeRes.json();
        if (scrapeRes.ok) {
          // Re-fetch to get data
          const retryRes = await fetch(`${API_BASE}/courses/${id}`);
          const updatedCourse = await retryRes.json();
          this.renderPlayer(updatedCourse);
        } else {
          throw new Error(scrapeData.error || "Failed to scrape course");
        }
      } else {
        this.renderPlayer(course);
      }
    } catch (e: any) {
      this.contentContainer!.innerHTML = `
        <div class="glass p-8 text-center">
          <i class="fa-solid fa-circle-xmark text-4xl mb-4 text-red-500"></i>
          <h2>فشل تحميل الدروس</h2>
          <p class="text-muted mb-4">${e.message}</p>
          <button class="btn btn-primary" style="background: #2196f3;" onclick="app.navigate('courses')">العودة للتصنيفات</button>
        </div>
      `;
    }
  }

  renderPlayer(course: Course) {
    const lessons = course.lessons_data || [];
    if (lessons.length === 0) {
      this.contentContainer!.innerHTML = `<div class="glass p-8 text-center"><h2>لا توجد دروس متاحة حالياً لهذا الكورس</h2><button class="btn glass" style="background: rgba(33, 150, 243, 0.2); color: #2196f3; border-color: #2196f3;" onclick="app.navigate('courses')">العودة</button></div>`;
      return;
    }

    this.contentContainer!.innerHTML = `
      <div class="fade-in">
        <button class="btn glass mb-6" style="background: rgba(33, 150, 243, 0.2); color: #2196f3; border-color: #2196f3;" onclick="app.navigate('courses')">
          <i class="fa-solid fa-arrow-right"></i> العودة للكورسات
        </button>
        
        <div class="section-title mb-2">
            <h1>${course.title}</h1>
        </div>
        <p class="text-muted mb-6"><i class="fa-solid fa-user-tie"></i> ${course.instructor} • ${lessons.length} درس</p>

        <div class="course-player-layout">
          <div class="video-area">
            <div class="video-container" id="main-player">
              <iframe id="video-iframe" src="https://www.youtube.com/embed/${lessons[0].videoId}?autoplay=1" allowfullscreen></iframe>
            </div>
          </div>
          
          <div class="lessons-sidebar">
             <div class="section-title mb-4"><h3>قائمة الدروس</h3></div>
             <div class="lesson-list-scroll" id="lesson-list-box">
                ${lessons.map((l, index) => `
                   <button class="lesson-item-btn ${index === 0 ? 'active' : ''}" 
                           onclick="app.switchVideo('${l.videoId}', this)">
                      <div class="l-title">${l.title}</div>
                      <div class="l-dur"><i class="fa-solid fa-clock"></i> ${l.duration}</div>
                   </button>
                `).join('')}
             </div>
          </div>
        </div>
      </div>
    `;
  }

  switchVideo(id: string, btn: HTMLElement) {
    const iframe = document.getElementById('video-iframe') as HTMLIFrameElement;
    if (iframe) iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1`;

    document.querySelectorAll('.lesson-item-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Smooth scroll player into view for mobile
    if (window.innerWidth < 1024) {
      document.getElementById('main-player')?.scrollIntoView({ behavior: 'smooth' });
    }
  }


  updateLoadMore(type: 'books' | 'courses', totalOverride?: number) {
    const container = document.getElementById('load-more-container');
    if (!container) return;

    const count = type === 'books' ? this.displayedBooksCount : this.displayedCoursesCount;
    let total = totalOverride;

    if (total === undefined) {
      if (type === 'books') {
        total = this.currentCategory ? this.allBooks.filter(b => b.category === this.currentCategory).length : this.allBooks.length;
      } else {
        total = this.currentCategory ? this.courses.filter(c => c.category === this.currentCategory).length : this.courses.length;
      }
    }

    if (count < total) {
      container.innerHTML = `<button class="btn glass load-more-btn" onclick="app.loadMore('${type}')">عرض المزيد (${total - count})</button>`;
    } else {
      container.innerHTML = `<p class="text-muted">نهاية القائمة</p>`;
    }
  }

  loadMore(type: 'books' | 'courses') {
    if (type === 'books') {
      this.displayedBooksCount += this.itemsPerPage;
      this.displayItems(this.books.slice(0, this.displayedBooksCount));
    } else {
      this.displayedCoursesCount += this.itemsPerPage;
      this.displayCourses(this.courses.slice(0, this.displayedCoursesCount));
    }
    this.updateLoadMore(type);
  }

  setupSearch() {
    const input = document.getElementById('search-input') as HTMLInputElement;
    input?.addEventListener('input', (e) => {
      const q = (e.target as HTMLInputElement).value.toLowerCase();

      if (!q) {
        this.navigate(this.currentPath);
        return;
      }

      const booksResult = this.allBooks.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.category?.toLowerCase().includes(q)
      );
      const coursesResult = this.courses.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.instructor?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q)
      );

      this.contentContainer!.innerHTML = `
        <div class="fade-in">
          <div class="section-header">
             <h2>نتائج البحث عن: <span class="text-primary">"${q}"</span></h2>
          </div>
          
          ${coursesResult.length > 0 ? `
            <div class="section-header mt-8"><h3><i class="fa-solid fa-graduation-cap"></i> الكورسات التعليمية (${coursesResult.length})</h3></div>
            <div class="book-grid" id="search-courses-grid"></div>
          ` : ''}
          
          ${booksResult.length > 0 ? `
            <div class="section-header mt-8"><h3><i class="fa-solid fa-book"></i> الكتب والمراجع (${booksResult.length})</h3></div>
            <div class="book-grid" id="search-books-grid"></div>
          ` : ''}

          ${booksResult.length === 0 && coursesResult.length === 0 ? `
            <div class="glass p-12 text-center mt-8">
              <i class="fa-solid fa-face-frown text-4xl mb-4 text-muted"></i>
              <h3 class="text-lg">لا توجد نتايج للبحث</h3>
              <p class="text-muted">جرب كلمات بحث مختلفة مثل "برمجة" أو "لاهوت"</p>
            </div>
          ` : ''}
        </div>
      `;

      if (coursesResult.length > 0) {
        this.gridContainer = document.getElementById('search-courses-grid');
        this.displayCourses(coursesResult.slice(0, 12));
      }
      if (booksResult.length > 0) {
        this.gridContainer = document.getElementById('search-books-grid');
        this.displayItems(booksResult.slice(0, 12));
      }
    });
  }

  renderChurchVideos() {
    const collections = [
      {
        title: 'ألحان قبطية', icon: 'fa-dove', videos: [
          { title: 'لحن انثوتي تي شوري - خوروس CTV', id: '7elB2G0jgUg' },
          { title: 'مزمور 150 قبطى - أبونا داود لمعي', id: 'Du7AWxsuGEE' },
          { title: 'المزمور 150 سبحوا الله - الصوم المقدس', id: '8bjECNGwXy4' },
          { title: 'تي هيريني إنتيه إفنوتي - مرد الإنجيل', id: 'PI2UgBX4POI' },
          { title: 'لحن شاريه افنوتي - مرد الابركسيس', id: 'rgWR6P2ZbOo' },
          { title: 'لحن أوكيريوس ميتاسو - الرب معك', id: '94v3N1fTYt4' },
          { title: 'المعلم جاد لويس - لحن تى هيرينى', id: 'IvSI3ELT1oQ' },
          { title: 'لحن أوكيريوس ميتاسو - للعذراء مريم', id: 'mS5bg7rE2i4' },
          { title: 'اوكيريوس ميتاسو - بالهزات', id: 'y-rtvsPUpk4' }
        ]
      },
      {
        title: 'ألحان تعليمية - بولا منير', icon: 'fa-chalkboard-user', videos: [
          { title: 'الهيتينيات السنوى تعليمي', id: 'tYvgRxZFrKM' },
          { title: 'لحن تي شوري ϯϣⲟⲩⲣⲓ السنوي تعليمي', id: 'k_ocz1ZH6wA' },
          { title: 'لحن بي أوأووفا بين نوتي بى الكبيرة', id: 'FFPoFpqAMjo' },
          { title: 'لحن بي اهموت غار ⲡⲓ ϩ̀ⲙⲟⲧ ⲅⲁⲣ الصغير', id: 'IczdbVObkiA' },
          { title: 'مرد الليلويا فاي بى بي تعليمي', id: 'MgOSq7e0pdI' },
          { title: 'مرد انجيل القداس السنوي أوأوونياتو', id: 'pApCFToT1IM' },
          { title: 'مرد الليلويا جي افميفي تعليمي', id: 'OxMjCwMSiKg' },
          { title: 'مرد الابركسيس السنوي تعليمي', id: 'ebfIoDL1yxU' },
          { title: 'لحن مرد الابركسيس الكبير - جزء 1', id: 'uRkNVEPXTOA' },
          { title: 'مرد سوتيس آمين المختصر - تعليمي', id: 'szehBI3Yu1w' },
          { title: 'مرد تين جوشت الغريغورى تعليمى', id: 'Mg8dB7NrI8U' }
        ]
      },
      {
        title: 'القداسات الإلهية', icon: 'fa-cross', videos: [
          { title: 'القداس الإلهي - بث مباشر', id: '-PANgP2mZ3Q' },
          { title: 'القداس الإلهي - أبونا داود لمعي', id: 'hGDwRsiwKP8' },
          { title: 'قداس عيد الميلاد المجيد', id: 'ZqReJPOil0c' },
          { title: 'القداس الإلهي - قداس كيهك', id: 'I_bDeSmsl14' }
        ]
      },
      {
        title: 'ألحان وترانيم مختارة', icon: 'fa-music', videos: [
          { title: 'لحن ابؤرو الفرايحى - المعلم ابراهيم عياد', id: 'zld51r43YyU' },
          { title: 'لحن افلوجيمينوس - الكلية الاكليريكية', id: 'X8J9esmjKbI' },
          { title: 'ترنيمة امسك يا رب ايدي', id: 'PcS-9LS0XZI' },
          { title: 'ترنيمة علشان خاطر العدرا يارب', id: 'rJSKuux7NOk' },
          { title: 'ترنيمة أصليله - فريق قلب داود', id: 'aibvA9JTl1A' },
          { title: 'انا حي بيك - ساتر ميخائيل و روماني روؤف', id: 'Eun7gACLCOs' },
          { title: 'ترنيمة مين أحن منك ألتجئ إليه', id: 'Iq236XeGY_c' },
          { title: 'ترنیمة اسمع صراخي يا سيدى - Better Life', id: 'ScExpKSA27w' },
          { title: 'ترنیمة أنا محتاج لمسة روحك - Better Life', id: '0WgbppJbO64' },
          { title: 'مراحمك يا إلهي - القس موسى رشدي', id: 'jvatk24SfIw' },
          { title: 'لحن ابؤرو - ساتر ميخائيل وروماني يسري', id: 'ScD5ifrQt_Q' }
        ]
      }
    ];

    // Group DB videos by collection
    const dbByCollection: Record<string, any[]> = {};
    this.dbChurchVideos.forEach(v => {
      const col = v.collection || 'فيديوهات مضافة';
      if (!dbByCollection[col]) dbByCollection[col] = [];
      dbByCollection[col].push(v);
    });
    const dbCollectionsHTML = Object.entries(dbByCollection).map(([colName, videos]) => `
      <div class="section-header mt-12">
        <div class="section-title">
          <i class="fa-solid fa-star text-primary"></i>
          <h2>${colName}</h2>
        </div>
        <span class="badge" style="background:rgba(16,185,129,0.15);color:#34d399;border:1px solid #34d399;font-size:0.75rem">مضاف من الأدمن</span>
      </div>
      <div class="book-grid">
        ${videos.map((v: any) => `
          <div class="book-card glass" onclick="app.playChurchVideo('${v.videoId}', '${v.title.replace(/'/g, "&apos;")}')" style="cursor: pointer;">
            <div class="video-thumb-container" style="position: relative;">
              <img src="https://img.youtube.com/vi/${v.videoId}/mqdefault.jpg" class="book-img" style="aspect-ratio: 16/9; object-fit: cover;">
              <div class="play-overlay"><i class="fa-solid fa-play"></i></div>
            </div>
            <div class="book-info">
              <div class="book-title text-sm">${v.title}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `).join('');

    this.contentContainer!.innerHTML = `
      <div class="fade-in">
        <div class="hero glass mb-8" style="background: linear-gradient(135deg, rgba(26, 115, 232, 0.2) 0%, rgba(103, 58, 183, 0.2) 100%);">
          <div class="hero-content">
            <span class="badge">مكتبة الميديا الكنسية</span>
            <h1>فيديوهات كنيستي</h1>
            <p class="text-muted">مجموعة مختارة من الفيديوهات التعليمية، الروحية، والقداسات لأجلك.</p>
          </div>
        </div>

        ${dbCollectionsHTML}

        ${collections.map(col => `
          <div class="section-header mt-12">
            <div class="section-title">
              <i class="fa-solid ${col.icon} text-primary"></i>
              <h2>${col.title}</h2>
            </div>
          </div>
          <div class="book-grid">
            ${col.videos.map(v => `
              <div class="book-card glass" onclick="app.playChurchVideo('${v.id}', '${v.title}')" style="cursor: pointer;">
                <div class="video-thumb-container" style="position: relative;">
                  <img src="https://img.youtube.com/vi/${v.id}/mqdefault.jpg" class="book-img" style="aspect-ratio: 16/9; object-fit: cover;">
                  <div class="play-overlay"><i class="fa-solid fa-play"></i></div>
                </div>
                <div class="book-info">
                  <div class="book-title text-sm">${v.title}</div>
                </div>
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>
    `;
  }

  playChurchVideo(id: string, title: string) {
    this.contentContainer!.innerHTML = `
      <div class="fade-in">
        <button class="btn glass mb-6" style="background: rgba(33, 150, 243, 0.2); color: #2196f3; border-color: #2196f3;" onclick="app.renderChurchVideos()">
          <i class="fa-solid fa-arrow-right"></i> العودة للفيديوهات
        </button>
        <h2 class="mb-6">${title}</h2>
        <div class="video-container">
          <iframe src="https://www.youtube.com/embed/${id}?autoplay=1" allowfullscreen></iframe>
        </div>
      </div>
    `;
  }

  renderPodcast() {
    if (!this.contentContainer) return;

    // Group DB podcasts by series
    const dbBySeries: Record<string, any[]> = {};
    this.dbPodcasts.forEach((p: any) => {
      const series = p.seriesTitle || 'حلقات مضافة';
      if (!dbBySeries[series]) dbBySeries[series] = [];
      dbBySeries[series].push(p);
    });
    const dbSeriesHTML = Object.entries(dbBySeries).map(([seriesName, eps]) => `
      <div class="glass mb-8" style="border-radius: 16px; padding: 24px; border: 1px solid rgba(16,185,129,0.3);">
        <div class="flex gap-4 mb-6" style="align-items: center; justify-content: space-between;">
          <div style="display:flex;gap:12px;align-items:center;">
            <div class="logo-icon"><i class="fa-solid fa-microphone fa-xl"></i></div>
            <div>
              <h3 style="margin: 0;">${seriesName}</h3>
              <span style="font-size:0.8rem;color:#34d399;">✅ مضاف من الأدمن</span>
            </div>
          </div>
        </div>
        <div class="video-grid">
          ${eps.map((ep: any) => `
            <div class="video-card glass" onclick="app.playPodcastEpisode('${ep.videoId}', '${(ep.episodeTitle || ep.title || '').replace(/'/g, "&apos;")}')"
              style="cursor:pointer; border-radius:12px; overflow:hidden; transition: transform 0.2s;">
              <div style="position:relative;">
                <img src="https://i.ytimg.com/vi/${ep.videoId}/hqdefault.jpg" alt="${ep.episodeTitle || ep.title}" style="width:100%;aspect-ratio:16/9;object-fit:cover;">
                <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.3);">
                  <i class="fa-solid fa-play" style="font-size:2rem;color:#fff;"></i>
                </div>
              </div>
              <div style="padding:12px;">
                <p style="margin:0;font-size:0.85rem;font-weight:600;line-height:1.4;">${ep.episodeTitle || ep.title}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

    const podcasts = [
      {
        title: 'بودكاست مدرسة الإسكندرية',
        description: 'لقاءات روحية وفكرية مع أبونا سارافيم البرموسي - قناة Alexandria School',
        icon: 'fa-microphone',
        episodes: [
          { title: 'بودكاست: الخوف عدو أم صديق (٥) | أبونا سارافيم البرموسي', id: 'kY2IUPk4HDo' },
          { title: 'بودكاست: الخوف عدو أم صديق (٤) | أبونا سارافيم البرموسي', id: 'bHVx9SKO2ec' },
          { title: 'بودكاست: الخوف عدو أم صديق (٣) | أبونا سارافيم البرموسي', id: 'rQnNWqKoOtE' },
          { title: 'بودكاست: الخوف عدو أم صديق (٢) | أبونا سارافيم البرموسي', id: 'jIPLgNPVIps' },
          { title: 'بودكاست: الخوف عدو أم صديق (١) | أبونا سارافيم البرموسي', id: 'C87mxr436WM' },
          { title: 'بودكاست: إيه دور النعمة في حياتنا؟ (٣) | أبونا سارافيم البرموسي', id: 'cTqNhBLkYEE' },
          { title: 'بودكاست: إيه دور النعمة في حياتنا؟ (٢) | أبونا سارافيم البرموسي', id: 'WEGHf-CVbPA' },
          { title: 'بودكاست: إيه دور النعمة في حياتنا؟ (١) | أبونا سارافيم البرموسي', id: 'CPJ1kR63Zlk' },
          { title: 'بودكاست: هل هناك أثر لسقوط الإنسان على حياتنا؟ (٣) | أبونا سارافيم البرموسي', id: 'gL0JKl9Aie0' },
          { title: 'بودكاست: هل هناك أثر لسقوط الإنسان على حياتنا؟ (٢) | أبونا سارافيم البرموسي', id: 'WTeCe2ns9ec' }
        ]
      },
      {
        title: 'بودكاست مسيحي',
        description: 'مجموعة متكاملة من الحلقات الروحية والتأملية',
        icon: 'fa-cross',
        episodes: [
          { title: 'الحلقة ١', id: 'ImKCFmXDU2M' },
          { title: 'الحلقة ٢', id: 'yYiulqyyJLI' },
          { title: 'الحلقة ٣', id: 'KBj_4SDrtus' },
          { title: 'الحلقة ٤', id: 'aBxZxZoom7A' },
          { title: 'الحلقة ٥', id: 'Tp_zVYLA0Do' },
          { title: 'الحلقة ٦', id: '75EOapd8I0A' },
          { title: 'الحلقة ٧', id: 'g8JVJ5OyzgE' },
          { title: 'الحلقة ٨', id: '89XShjL8K5c' },
          { title: 'الحلقة ٩', id: 'hE0a8DBy9dA' },
          { title: 'الحلقة ١٠', id: 'vQcv7gaHenE' },
          { title: 'الحلقة ١١', id: '8dKNSjnZOOs' },
          { title: 'الحلقة ١٢', id: 'wUFrGP-LM_0' },
          { title: 'الحلقة ١٣', id: 'WoRnds5mQ1c' },
          { title: 'الحلقة ١٤', id: 'XNxd0cbv8m0' },
          { title: 'الحلقة ١٥', id: '7SmQHAewi6I' },
          { title: 'الحلقة ١٦', id: '41dSRbZy7dk' },
          { title: 'الحلقة ١٧', id: '13ces8MYj7A' },
          { title: 'الحلقة ١٨', id: 'HDKBTw2iNYQ' },
          { title: 'الحلقة ١٩', id: 'pk3qCgxM9P8' },
          { title: 'الحلقة ٢٠', id: '8FjS8SH_3kM' },
          { title: 'الحلقة ٢١', id: 'AP7wTVUAlHE' },
          { title: 'الحلقة ٢٢', id: 'Tl0GjBZAo-U' },
          { title: 'الحلقة ٢٣', id: 'bmabTSsXK30' },
          { title: 'الحلقة ٢٤', id: 'YeUNvFb7EwE' },
          { title: 'الحلقة ٢٥', id: 'wI17FtWRItU' },
          { title: 'الحلقة ٢٦', id: 'iULdLxcRefg' },
          { title: 'الحلقة ٢٧', id: '4tRr83dQwN8' },
          { title: 'الحلقة ٢٨', id: 'MOn2G4TykBA' },
          { title: 'الحلقة ٢٩', id: 'zGxcsZD7R1c' },
          { title: 'الحلقة ٣٠', id: 'FO9roVyXwn4' },
          { title: 'الحلقة ٣١', id: 'rV4m9gWVRgo' },
          { title: 'الحلقة ٣٢', id: 'cv9STj0IrcU' },
          { title: 'الحلقة ٣٣', id: 'kGe7k39k4QU' },
          { title: 'الحلقة ٣٤', id: 'o8gWsOrKUfU' },
          { title: 'الحلقة ٣٥', id: '6eeW99vW2J0' },
          { title: 'الحلقة ٣٦', id: 'lXF7H5S7ETU' },
          { title: 'الحلقة ٣٧', id: 'df7w9iMzvUg' },
          { title: 'الحلقة ٣٨', id: 'egoVRimXklI' },
          { title: 'الحلقة ٣٩', id: 'hr8Tho7zd5s' },
          { title: 'الحلقة ٤٠', id: 'MmCkdqq5rmU' },
          { title: 'الحلقة ٤١', id: 'dN_PILhyadg' },
          { title: 'الحلقة ٤٢', id: 'bQfhI4X_xEE' },
          { title: 'الحلقة ٤٣', id: 'II-L-tAyU4A' },
          { title: 'الحلقة ٤٤', id: 'mH3m9Wst0BA' },
          { title: 'الحلقة ٤٥', id: '2sre8wYF4qY' },
          { title: 'الحلقة ٤٦', id: 'pQWX1H14jkE' },
          { title: 'الحلقة ٤٧', id: 'uxNWnPEUDR4' },
          { title: 'الحلقة ٤٨', id: 'rcar5XnruWQ' },
          { title: 'الحلقة ٤٩', id: 'BXjWVbL_prM' },
          { title: 'الحلقة ٥٠', id: 'W6HubU5x9no' },
          { title: 'الحلقة ٥١', id: 'nNWi22L-JX4' },
          { title: 'الحلقة ٥٢', id: 'Pu04wztAKMs' },
          { title: 'الحلقة ٥٣', id: 'Csz7fmKx2ws' },
          { title: 'الحلقة ٥٤', id: '5eTX13fEOvk' },
          { title: 'الحلقة ٥٥', id: 'GoeetsLFuqM' },
          { title: 'الحلقة ٥٦', id: 'IGMGnLJwEao' },
          { title: 'الحلقة ٥٧', id: 'M7cUp3sdr1g' },
          { title: 'الحلقة ٥٨', id: 'nSsYnOY-ZuE' },
          { title: 'الحلقة ٥٩', id: 'uwYjJoNIgks' },
          { title: 'الحلقة ٦٠', id: '3LuG41hig0k' },
          { title: 'الحلقة ٦١', id: 'eqnGZNMINHM' },
          { title: 'الحلقة ٦٢', id: 'duBnandRdpE' },
          { title: 'الحلقة ٦٣', id: 'tm3tD3sCyis' },
          { title: 'الحلقة ٦٤', id: 'IUq6xd4b3L0' },
          { title: 'الحلقة ٦٥', id: 'F8knWukhoHg' },
          { title: 'الحلقة ٦٦', id: 'HUPVLUw0NfM' },
          { title: 'الحلقة ٦٧', id: 'b6kbYHVRm5E' },
          { title: 'الحلقة ٦٨', id: 'KKeX7HBLxS0' },
          { title: 'الحلقة ٦٩', id: 'vUpuhnorlus' },
          { title: 'الحلقة ٧٠', id: 'Yg0S428q3Ho' },
          { title: 'الحلقة ٧١', id: 'dScHLYRvYFk' },
          { title: 'الحلقة ٧٢', id: '4w1O9qIXuNQ' },
          { title: 'الحلقة ٧٣', id: 'AKCU5QWNy6s' },
          { title: 'الحلقة ٧٤', id: '6DN-RISJnio' },
          { title: 'الحلقة ٧٥', id: '1UjoJVXkynw' },
          { title: 'الحلقة ٧٦', id: 'I4R6OIhqomE' },
          { title: 'الحلقة ٧٧', id: 'Oe0TNxR-B4s' },
          { title: 'الحلقة ٧٨', id: 'wgvh3ZqRYMM' },
          { title: 'الحلقة ٧٩', id: 'L0Drz6ih4Gc' },
          { title: 'الحلقة ٨٠', id: 'Rcuz-RBOqrU' },
          { title: 'الحلقة ٨١', id: '3Nhm2rXmGZI' },
          { title: 'الحلقة ٨٢', id: 'hzigYcuzKvM' },
          { title: 'الحلقة ٨٣', id: 'KZFXhJeBW9M' },
          { title: 'الحلقة ٨٤', id: 'sBYLVjqoJ2g' },
          { title: 'الحلقة ٨٥', id: '8JJKmoSzv6o' },
          { title: 'الحلقة ٨٦', id: '_Tr0Jmh8fLA' },
          { title: 'الحلقة ٨٧', id: '0Ddz2e10Uhc' },
          { title: 'الحلقة ٨٨', id: 'uZX1wI2JKAI' },
          { title: 'الحلقة ٨٩', id: 'KRqoaNKM1WE' },
          { title: 'الحلقة ٩٠', id: 'e6WKn4PmYD8' },
          { title: 'الحلقة ٩١', id: '2QYhtIpMMV4' },
          { title: 'الحلقة ٩٢', id: 'YsOTbntPmoo' },
          { title: 'الحلقة ٩٣', id: 'yYeLCwfWg3k' },
          { title: 'الحلقة ٩٤', id: 'DC9ylR1MhIE' },
          { title: 'الحلقة ٩٥', id: 'WlQn4UU-QTY' },
          { title: 'الحلقة ٩٦', id: '-gSNOSjOVpc' },
          { title: 'الحلقة ٩٧', id: '7ALOYmIAhBA' },
          { title: 'الحلقة ٩٨', id: 'SwqLh3w668c' },
          { title: 'الحلقة ٩٩', id: 'GHNfUzpC-SI' },
          { title: 'الحلقة ١٠٠', id: 'ovjTCsTKYmc' }
        ]
      },
      {
        title: 'بودكاست جرانيت',
        description: 'بودكاست جرانيت - حلقات متعمقة في الحياة والإيمان',
        icon: 'fa-podcast',
        episodes: [
          { title: 'الحلقة ١', id: 'JcMhVP0NGTc' },
          { title: 'الحلقة ٢', id: 's-LqwvvR9RI' },
          { title: 'الحلقة ٣', id: 'qTEE5jVgLiU' },
          { title: 'الحلقة ٤', id: 'nuknR9vZTL4' },
          { title: 'الحلقة ٥', id: 'PMp2qqWvLgQ' },
          { title: 'الحلقة ٦', id: 'tgeW326D3Rc' },
          { title: 'الحلقة ٧', id: '3sOuFZ6Z0Q0' },
          { title: 'الحلقة ٨', id: 'ZBthIl9lreY' },
          { title: 'الحلقة ٩', id: 'v2oH2mk-U2k' },
          { title: 'الحلقة ١٠', id: 'WQH9mh5oo84' },
          { title: 'الحلقة ١١', id: 'nKrFWZK50FQ' },
          { title: 'الحلقة ١٢', id: 'zI3LJwB8y90' },
          { title: 'الحلقة ١٣', id: 'f1mw3Z0PswE' },
          { title: 'الحلقة ١٤', id: 'MMEDx-PGCyg' },
          { title: 'الحلقة ١٥', id: 'ziud7ywFAjU' },
          { title: 'الحلقة ١٦', id: 'OJFQx78Eclk' },
          { title: 'الحلقة ١٧', id: 'FTjvR_Nmjxg' },
          { title: 'الحلقة ١٨', id: 'q8k-Fcnl0HA' },
          { title: 'الحلقة ١٩', id: 'EkQ-Eyl2pcY' },
          { title: 'الحلقة ٢٠', id: 'l4XbMHs9q7E' },
          { title: 'الحلقة ٢١', id: 'SOoi1R7smgI' },
          { title: 'الحلقة ٢٢', id: 'xf2_EtwKIXQ' },
          { title: 'الحلقة ٢٣', id: '6Vc89J37CIo' },
          { title: 'الحلقة ٢٤', id: 'HI6OE046WLA' },
          { title: 'الحلقة ٢٥', id: '4v6QrYcdP-0' },
          { title: 'الحلقة ٢٦', id: 'gUoEtmMhpJw' },
          { title: 'الحلقة ٢٧', id: 'Oe0mCe_Dqgk' },
          { title: 'الحلقة ٢٨', id: 'cZGF2j4U9AY' },
          { title: 'الحلقة ٢٩', id: 'fVM6Gd8ruAI' },
          { title: 'الحلقة ٣٠', id: 'xzI0DaoSgOo' },
          { title: 'الحلقة ٣١', id: 'K8IFHkgyhis' },
          { title: 'الحلقة ٣٢', id: 'aYtzGgUJIxs' },
          { title: 'الحلقة ٣٣', id: 'Fo7cgkhwwcU' },
          { title: 'الحلقة ٣٤', id: 'kQICgatmoUQ' },
          { title: 'الحلقة ٣٥', id: 'rIXkrYt6of4' },
          { title: 'الحلقة ٣٦', id: 'yg4F38RvhvU' },
          { title: 'الحلقة ٣٧', id: 'CSWB7RlXHok' },
          { title: 'الحلقة ٣٨', id: 'ZN4fFnc9IpE' },
          { title: 'الحلقة ٣٩', id: 'CUbKfuPM4vk' },
          { title: 'الحلقة ٤٠', id: 'ZSqaOEsJOtI' },
          { title: 'الحلقة ٤١', id: 'fmWwN0PKJXg' },
          { title: 'الحلقة ٤٢', id: 'Q-HC2WrYaWI' },
          { title: 'الحلقة ٤٣', id: '4z13CJSWArg' },
          { title: 'الحلقة ٤٤', id: 'oB6pVNHWCqQ' },
          { title: 'الحلقة ٤٥', id: 'OsaHq8xfR28' },
          { title: 'الحلقة ٤٦', id: 'Y4XPtfyTLk0' },
          { title: 'الحلقة ٤٧', id: 'LvqO1myty3U' },
          { title: 'الحلقة ٤٨', id: 'jS2o0xvWzDQ' },
          { title: 'الحلقة ٤٩', id: 'DsGJbVW0phs' },
          { title: 'الحلقة ٥٠', id: 'u58XRiPfbDA' },
          { title: 'الحلقة ٥١', id: 'PJZWBH4IYM8' },
          { title: 'الحلقة ٥٢', id: 'ucxKT1QPibo' },
          { title: 'الحلقة ٥٣', id: '4sq0cJ3bqaU' },
          { title: 'الحلقة ٥٤', id: 'Rn8D4CL-VTU' },
          { title: 'الحلقة ٥٥', id: '4QqaRzEio-I' },
          { title: 'الحلقة ٥٦', id: 'TTEV7PpqkbE' },
          { title: 'الحلقة ٥٧', id: '1AUvCr5CgpU' },
          { title: 'الحلقة ٥٨', id: 'A6tYTVVaepE' },
          { title: 'الحلقة ٥٩', id: 'KSE3LzMN4PM' },
          { title: 'الحلقة ٦٠', id: 'BEilKCMDLXE' },
          { title: 'الحلقة ٦١', id: 'zYYECgVxRqY' },
          { title: 'الحلقة ٦٢', id: 'RPAAc_EtI54' },
          { title: 'الحلقة ٦٣', id: 'drMrZqP25E0' },
          { title: 'الحلقة ٦٤', id: 'F1fZ02Tgy-M' },
          { title: 'الحلقة ٦٥', id: 'Pfwaw_7O90A' },
          { title: 'الحلقة ٦٦', id: 'UX8mmPM7u2g' },
          { title: 'الحلقة ٦٧', id: '18yDEndVhcc' },
          { title: 'الحلقة ٦٨', id: 'rwXxW6pFRsE' },
          { title: 'الحلقة ٦٩', id: 'HWReMFaHXew' },
          { title: 'الحلقة ٧٠', id: 'j6K6SVez4O0' },
          { title: 'الحلقة ٧١', id: 'w0AjL8LcAlM' },
          { title: 'الحلقة ٧٢', id: '4OumKxFRdo0' },
          { title: 'الحلقة ٧٣', id: 'rA7ce7gJEdg' },
          { title: 'الحلقة ٧٤', id: 'vH3sgS9ksK4' },
          { title: 'الحلقة ٧٥', id: 'bULM2zUe9Yc' },
          { title: 'الحلقة ٧٦', id: 'LKjkBpuJDYA' },
          { title: 'الحلقة ٧٧', id: 'KtPNlonks-I' },
          { title: 'الحلقة ٧٨', id: 'jjB5pCA5voM' },
          { title: 'الحلقة ٧٩', id: 'YtxkhiwiUqg' },
          { title: 'الحلقة ٨٠', id: 'wQYP0xxMFs4' },
          { title: 'الحلقة ٨١', id: '2p2lThHhVLM' },
          { title: 'الحلقة ٨٢', id: 'IVp8GhppViE' },
          { title: 'الحلقة ٨٣', id: 'n9VookFrmHM' },
          { title: 'الحلقة ٨٤', id: 'f0V8iHMTXmo' },
          { title: 'الحلقة ٨٥', id: 'o4rcf-fAhQk' },
          { title: 'الحلقة ٨٦', id: '0ftyVRndw0c' },
          { title: 'الحلقة ٨٧', id: 'J82vS3_thCk' },
          { title: 'الحلقة ٨٨', id: 'Xb0cD_vulYc' },
          { title: 'الحلقة ٨٩', id: 'UG3W7-geSeo' },
          { title: 'الحلقة ٩٠', id: 'TeG1LxpJ-Ww' },
          { title: 'الحلقة ٩١', id: 'dvz95inTWj0' },
          { title: 'الحلقة ٩٢', id: 'c46oXZB9LKI' },
          { title: 'الحلقة ٩٣', id: 'rjULkUxh92g' },
          { title: 'الحلقة ٩٤', id: 'eAFq_MeHSdk' },
          { title: 'الحلقة ٩٥', id: 'Phy0mPpVHT8' },
          { title: 'الحلقة ٩٦', id: 'UvCBHcVbgG0' },
          { title: 'الحلقة ٩٧', id: '-XHtAwVKQyk' },
          { title: 'الحلقة ٩٨', id: '3EizoCMp6mo' },
          { title: 'الحلقة ٩٩', id: 'd11gPOVfrrY' },
          { title: 'الحلقة ١٠٠', id: 'sbdk32cAygA' },
          { title: 'الحلقة ١٠١', id: 'LsnpXQ5QFiw' },
          { title: 'الحلقة ١٠٢', id: 'x0TMCjBW9vU' },
          { title: 'الحلقة ١٠٣', id: 'bFIoZkFC1U0' },
          { title: 'الحلقة ١٠٤', id: 'p-JyIA7gVSA' },
          { title: 'الحلقة ١٠٥', id: 'e7H0s7A119A' },
          { title: 'الحلقة ١٠٦', id: 'FFzt268fW7g' },
          { title: 'الحلقة ١٠٧', id: 'sDfoxBUdggI' },
          { title: 'الحلقة ١٠٨', id: '2HS6cOrNDJM' }
        ]
      }
    ];

    this.contentContainer.innerHTML = `
      <div class="fade-in">
        <div class="section-header mb-8">
          <h2><i class="fa-solid fa-microphone"></i> بودكاست</h2>
          <p class="text-muted mt-2">استمع لأحدث الحلقات الروحية والفكرية</p>
        </div>
        ${dbSeriesHTML}
        ${podcasts.map((podcast: any) => `
          <div class="glass mb-8" style="border-radius: 16px; padding: 24px;">
            <div class="flex gap-4 mb-6" style="align-items: center;">
              <div class="logo-icon">
                <i class="fa-solid ${podcast.icon} fa-xl"></i>
              </div>
              <div>
                <h3 style="margin: 0;">${podcast.title}</h3>
                <p class="text-muted" style="margin: 4px 0 0;font-size:0.9rem;">${podcast.description}</p>
              </div>
            </div>
            <div class="video-grid">
              ${podcast.episodes.map((ep: any) => `
                <div class="video-card glass" onclick="app.playPodcastEpisode('${ep.id}', '${ep.title.replace(/'/g, "&apos;")}')"
                  style="cursor:pointer; border-radius:12px; overflow:hidden; transition: transform 0.2s;">
                  <div style="position:relative;">
                    <img src="https://i.ytimg.com/vi/${ep.id}/hqdefault.jpg" alt="${ep.title}" style="width:100%;aspect-ratio:16/9;object-fit:cover;">
                    <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.3);">
                      <i class="fa-solid fa-play" style="font-size:2rem;color:#fff;"></i>
                    </div>
                  </div>
                  <div style="padding:12px;">
                    <p style="margin:0;font-size:0.85rem;font-weight:600;line-height:1.4;">${ep.title}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  playPodcastEpisode(id: string, title: string) {
    this.contentContainer!.innerHTML = `
      <div class="fade-in">
        <button class="btn glass mb-6" style="background: rgba(33, 150, 243, 0.2); color: #2196f3; border-color: #2196f3;" onclick="app.renderPodcast()">
          <i class="fa-solid fa-arrow-right"></i> العودة للبودكاست
        </button>
        <h2 class="mb-6">${title}</h2>
        <div class="video-container">
          <iframe src="https://www.youtube.com/embed/${id}?autoplay=1" allowfullscreen></iframe>
        </div>
      </div>
    `;
  }

  renderKids() {
    if (!this.contentContainer) return;

    // Group DB kids videos by section
    const dbKidsBySection: Record<string, any[]> = {};
    this.dbKidsVideos.forEach((v: any) => {
      const sec = v.sectionTitle || 'فيديوهات مضافة';
      if (!dbKidsBySection[sec]) dbKidsBySection[sec] = [];
      dbKidsBySection[sec].push(v);
    });
    const dbKidsSectionsHTML = Object.entries(dbKidsBySection).map(([secName, videos]) => `
      <div class="section-title mb-6">
        <i class="fa-solid ${videos[0]?.icon || 'fa-star'}" style="color: ${videos[0]?.color || '#ffc107'}"></i>
        <h2>${secName} <span style="font-size:0.7rem;background:rgba(16,185,129,0.15);color:#34d399;border:1px solid #34d399;padding:2px 8px;border-radius:20px;margin-right:8px">✅ مضاف</span></h2>
      </div>
      <div class="book-grid mb-12">
        ${videos.map((v: any) => `
          <div class="book-card glass" onclick="app.playKidsVideo('${v.videoId}', '${v.title.replace(/'/g, "&apos;")}')" style="cursor: pointer;">
            <div class="video-thumb-container">
              <img src="https://i.ytimg.com/vi/${v.videoId}/mqdefault.jpg" alt="${v.title}" class="book-img" style="aspect-ratio: 16/9; object-fit: cover;">
              <div class="play-overlay" style="background: ${v.color || '#ffc107'}cc;"><i class="fa-solid fa-play"></i></div>
            </div>
            <div class="book-info">
              <div class="book-title text-sm">${v.title}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `).join('');

    this.contentContainer.innerHTML = `
      <div class="fade-in">
        <div class="hero glass mb-8" style="background: linear-gradient(135deg, rgba(255, 75, 130, 0.2) 0%, rgba(255, 193, 7, 0.2) 100%);">
          <div class="hero-content">
            <span class="badge" style="background: rgba(255, 75, 130, 0.1); color: #ff4b82;">عالم الأبطال الصغار</span>
            <h1>ركن الأطفال المبدعين</h1>
            <p class="text-muted">أجمل الفيديوهات والقصص الروحية الممتعة لأحبائي الأطفال.</p>
          </div>
          <div class="hero-img">
            <i class="fa-solid fa-face-laugh-beam fa-8x" style="color: #ffc107; opacity: 0.3;"></i>
          </div>
        </div>

        <div class="glass p-8 mb-12 text-center" style="border-radius: 30px; border: 2px solid #ffc107;">
          <h2 class="mb-4"><i class="fa-solid fa-gamepad text-primary"></i> العب وتعلم</h2>
          <p class="mb-6">اختر لعبتك المفضلة الآن واجمع النقاط!</p>
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <button class="btn btn-primary" style="background: #ffc107; color: #000;" onclick="app.startVerseGame()">
              لعبة الآيات المفقودة 🧩
            </button>
            <button class="btn btn-primary" style="background: #4caf50; color: #fff; border-color: #4caf50;" onclick="app.startTrueFalseGame()">
              لعبة صح أم خطأ ✅❌
            </button>
          </div>
        </div>

        ${dbKidsSectionsHTML}

        ${this.kidsSections.map(section => `
          <div class="section-title mb-6">
            <i class="fa-solid ${section.icon}" style="color: ${section.color}"></i>
            <h2>${section.title}</h2>
          </div>
          <div class="book-grid mb-12">
            ${section.videos.map(v => `
              <div class="book-card glass" onclick="app.playKidsVideo('${v.id}', '${v.title.replace(/'/g, "&apos;")}')" style="cursor: pointer;">
                <div class="video-thumb-container">
                  <img src="https://i.ytimg.com/vi/${v.id}/mqdefault.jpg" alt="${v.title}" class="book-img" 
                       style="aspect-ratio: 16/9; object-fit: cover;">
                  <div class="play-overlay" style="background: ${section.color}cc;"><i class="fa-solid fa-play"></i></div>
                </div>
                <div class="book-info">
                  <div class="book-title text-sm">${v.title}</div>
                </div>
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>
    `;
  }

  startVerseGame() {
    this.currentPath = 'verse-game';
    this.gameScore = 0;
    this.renderVerseGame();
  }

  renderVerseGame() {
    if (!this.contentContainer) return;

    // Pick a random verse
    const verse = this.verses[Math.floor(Math.random() * this.verses.length)];
    const words = verse.text.split(' ');

    // Pick a random word to hide (ensure it's not a common small word if possible)
    let hideIndex = Math.floor(Math.random() * words.length);
    const correctWord = words[hideIndex];

    // Create view of the verse with a placeholder
    const displayVerse = words.map((w, i) => i === hideIndex ? '<span class="missing-word-placeholder">....</span>' : w).join(' ');

    // Generate distractors (wrong options)
    const allWords = this.verses.flatMap(v => v.text.split(' ')).filter(w => w !== correctWord && w.length > 2);
    const distractors: string[] = [];
    while (distractors.length < 2) {
      const randWord = allWords[Math.floor(Math.random() * allWords.length)];
      if (!distractors.includes(randWord)) distractors.push(randWord);
    }

    const options = [correctWord, ...distractors].sort(() => Math.random() - 0.5);

    this.contentContainer.innerHTML = `
      <div class="fade-in">
        <button class="btn glass mb-6" style="background: rgba(33, 150, 243, 0.2); color: #2196f3; border-color: #2196f3;" onclick="app.renderKids()">
          <i class="fa-solid fa-arrow-right"></i> العودة لركن الأطفال
        </button>
        
        <div class="game-container">
          <div class="game-score-board">نقاطك: ${this.gameScore} ⭐</div>
          
          <h2 class="text-primary mb-4">أكمل الآية</h2>
          <div class="verse-box">"${displayVerse}"</div>
          
          <div class="options-grid">
            ${options.map(opt => `
              <button class="game-option-btn" onclick="app.checkVerseAnswer('${opt}', '${correctWord}', this)">
                ${opt}
              </button>
            `).join('')}
          </div>
          
          <div id="game-feedback" class="encouragement-text"></div>
        </div>
        
        <div class="mt-8 text-center text-muted">
           <small><i class="fa-solid fa-quote-left"></i> ${verse.reference}</small>
        </div>
      </div>
    `;
  }

  checkVerseAnswer(selected: string, correct: string, btn: HTMLElement) {
    const feedback = document.getElementById('game-feedback');
    const allBtns = document.querySelectorAll('.game-option-btn');
    allBtns.forEach(b => (b as HTMLButtonElement).disabled = true); // Disable all after one click

    if (selected === correct) {
      this.gameScore++;
      btn.classList.add('correct');
      if (feedback) feedback.innerHTML = "أحسنت! إجابة صحيحة 🌈";

      const scoreBoard = document.querySelector('.game-score-board');
      if (scoreBoard) scoreBoard.innerHTML = `نقاطك: ${this.gameScore} ⭐`;

      setTimeout(() => this.renderVerseGame(), 1500);
    } else {
      btn.classList.add('wrong');
      if (feedback) feedback.innerHTML = "حاول مرة أخرى يا بطل! 💪";
      setTimeout(() => {
        allBtns.forEach(b => (b as HTMLButtonElement).disabled = false);
        feedback!.innerHTML = "";
      }, 1500);
    }
  }

  startTrueFalseGame() {
    this.currentPath = 'tf-game';
    this.gameScore = 0;
    this.renderTrueFalseGame();
  }

  renderTrueFalseGame() {
    if (!this.contentContainer) return;

    const verse = this.verses[Math.floor(Math.random() * this.verses.length)];
    const isActuallyTrue = Math.random() > 0.5;
    let displayedText = verse.text;

    if (!isActuallyTrue) {
      // Create a false version by replacing one word
      const words = verse.text.split(' ');
      const allWords = this.verses.flatMap(v => v.text.split(' ')).filter(w => !words.includes(w) && w.length > 3);
      const fakeWord = allWords[Math.floor(Math.random() * allWords.length)];

      const replaceIndex = Math.floor(Math.random() * words.length);
      words[replaceIndex] = `<span class="false-word">${fakeWord}</span>`;
      displayedText = words.join(' ');
    }

    this.contentContainer.innerHTML = `
      <div class="fade-in">
        <button class="btn glass mb-6" style="background: rgba(33, 150, 243, 0.2); color: #2196f3; border-color: #2196f3;" onclick="app.renderKids()">
          <i class="fa-solid fa-arrow-right"></i> العودة لركن الأطفال
        </button>
        
        <div class="game-container">
          <div class="game-score-board">نقاطك: ${this.gameScore} ⭐</div>
          
          <h2 class="text-primary mb-4">صح أم خطأ؟</h2>
          <p class="mb-4 text-muted">هل هذه الآية مكتوبة بشكل صحيح؟</p>
          
          <div class="verse-box tf-verse">"${displayedText}"</div>
          
          <div class="options-grid tf-options">
            <button class="game-option-btn tf-btn-true" onclick="app.checkTrueFalseAnswer(true, ${isActuallyTrue}, this)">
              <i class="fa-solid fa-check"></i> صح
            </button>
            <button class="game-option-btn tf-btn-false" onclick="app.checkTrueFalseAnswer(false, ${isActuallyTrue}, this)">
              <i class="fa-solid fa-xmark"></i> خطأ
            </button>
          </div>
          
          <div id="game-feedback" class="encouragement-text"></div>
        </div>
        
        <div class="mt-8 text-center text-muted">
           <small><i class="fa-solid fa-quote-left"></i> ${verse.reference}</small>
        </div>
      </div>
    `;
  }

  checkTrueFalseAnswer(selected: boolean, correct: boolean, btn: HTMLElement) {
    const feedback = document.getElementById('game-feedback');
    const allBtns = document.querySelectorAll('.game-option-btn');
    allBtns.forEach(b => (b as HTMLButtonElement).disabled = true);

    if (selected === correct) {
      this.gameScore++;
      btn.classList.add('correct');
      if (feedback) feedback.innerHTML = "أنت رائع! إجابة صحيحة 🌈";

      const scoreBoard = document.querySelector('.game-score-board');
      if (scoreBoard) scoreBoard.innerHTML = `نقاطك: ${this.gameScore} ⭐`;

      setTimeout(() => this.renderTrueFalseGame(), 1500);
    } else {
      btn.classList.add('wrong');
      if (feedback) feedback.innerHTML = "ركز أكثر في المرة القادمة! 💪";
      setTimeout(() => this.renderTrueFalseGame(), 1500);
    }
  }

  playKidsVideo(id: string, title: string) {
    if (!this.contentContainer) return;

    // Find all other videos to show them as "Suggested"
    const allVideos = this.kidsSections.flatMap(s => s.videos);
    const suggestedVideos = allVideos.filter(v => v.id !== id).slice(0, 12); // Show 12 suggestions

    this.contentContainer.innerHTML = `
      <div class="fade-in">
        <button class="btn glass mb-6" style="background: rgba(33, 150, 243, 0.2); color: #2196f3; border-color: #2196f3;" onclick="app.renderKids()">
          <i class="fa-solid fa-arrow-right"></i> العودة لركن الأطفال
        </button>
        <h2 class="mb-6">${title}</h2>
        <div class="video-container mb-12">
          <iframe src="https://www.youtube.com/embed/${id}?autoplay=1" allowfullscreen></iframe>
        </div>

        <div class="section-title mb-6">
          <i class="fa-solid fa-clapperboard" style="color: #ffc107"></i>
          <h2>فيديوهات قد تعجبك</h2>
        </div>
        <div class="book-grid mb-12">
          ${suggestedVideos.map(v => `
            <div class="book-card glass" onclick="app.playKidsVideo('${v.id}', '${v.title.replace(/'/g, "&apos;")}')" style="cursor: pointer;">
              <div class="video-thumb-container">
                <img src="https://i.ytimg.com/vi/${v.id}/mqdefault.jpg" alt="${v.title}" class="book-img" 
                     style="aspect-ratio: 16/9; object-fit: cover;">
                <div class="play-overlay" style="background: #ffc107cc;"><i class="fa-solid fa-play"></i></div>
              </div>
              <div class="book-info">
                <div class="book-title text-sm">${v.title}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  shareBook(title: string) {
    const shareData = {
      title: 'دار الكلمة',
      text: `أرشح لك قراءة كتاب: ${title}`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData).catch(err => console.log('Error sharing', err));
    } else {
      navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      alert('تم نسخ رابط الكتاب ومعلومات المشاركة!');
    }
  }

  renderAbout() {
    this.contentContainer!.innerHTML = `
      <div class="glass p-8 fade-in">
        <h2>عن المنارة التعليمية</h2>
        <p class="mt-4">هذا الموقع هو محرك منسق يهدف لتسهيل الوصول للمحتوى المسيحي العربي والكتب المجانية، بالإضافة إلى الدورات المعتمدة.</p>
        <p class="mt-2 text-muted">تم استخراج البيانات من مصادر مفتوحة وتصنيفها برمجياً لخدمتكم.</p>
      </div>
    `;
  }
}

const app = new LibraryApp();
(window as any).app = app;
