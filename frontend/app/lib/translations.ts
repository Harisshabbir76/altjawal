export type Trans = { en: string; ar: string };

// Single-element translations (querySelector)
export const SINGLE_TRANS: { selector: string; en: string; ar: string }[] = [
  // ── Hero ──
  { selector: '.hero-heading',   en: 'We Build Your Presence', ar: 'نبني حضورك' },
  { selector: '.hero-paragraph', en: 'Creating exceptional events, unforgettable experiences, and meaningful moments across the UAE.', ar: 'نصنع فعاليات استثنائية وتجارب لا تُنسى ولحظات ذات معنى في أنحاء الإمارات.' },
  { selector: '.hero-button',    en: 'Book a Consultation', ar: 'احجز استشارة' },

  // ── Vision ──
  { selector: '.vision-heading',   en: 'Designed Around Your Vision', ar: 'مصمم حول رؤيتك' },
  { selector: '.vision-paragraph', en: 'Every event tells a story. At AlTjawal, we blend authentic Emirati hospitality with contemporary event design to create experiences that are elegant, seamless, and unforgettable. From concept development to flawless execution, every detail is thoughtfully planned with creativity, precision, and care.', ar: 'كل فعالية تحكي قصة. في الجوال، نمزج الضيافة الإماراتية الأصيلة مع تصميم الفعاليات المعاصر لخلق تجارب أنيقة وسلسة ولا تُنسى. من تطوير المفهوم إلى التنفيذ المثالي، يتم التخطيط لكل تفصيلة بإبداع ودقة وعناية.' },
  { selector: '.vision-button',    en: 'Book Your Consultation Now', ar: 'احجز استشارتك الآن' },

  // ── Tradition ──
  { selector: '.tradition-heading', en: 'Inspired by Tradition. Crafted for Today.', ar: 'مستوحى من التراث. مصنوع لليوم.' },
  { selector: '.tradition-button',  en: 'Discover Our Story', ar: 'اكتشف قصتنا' },

  // ── Services ──
  { selector: '.services-heading',   en: 'Our Services', ar: 'خدماتنا' },
  { selector: '.services-paragraph', en: 'Born in Al Dhafra and proudly serving clients across all seven Emirates, AlTjawal brings together local heritage and modern creativity to deliver events that truly reflect your vision.', ar: 'ولدنا في الظفرة ونخدم بفخر عملاءنا في جميع الإمارات السبع، يجمع الجوال بين التراث المحلي والإبداع الحديث لتقديم فعاليات تعكس رؤيتك حقاً.' },

  // ── Choose Us ──
  { selector: '.chooseus-heading', en: 'Why Clients Choose Us', ar: 'لماذا يختارنا عملاؤنا' },

  // ── Experience ──
  { selector: '.experience-heading', en: 'Creating Experiences That Matter', ar: 'نصنع تجارب تترك أثراً' },

  // ── Purpose ──
  { selector: '.purpose-heading',   en: 'Events with Purpose', ar: 'فعاليات هادفة' },
  { selector: '.purpose-paragraph', en: 'Sustainability is part of every event we create. We prioritize reusable structures, recyclable materials, and responsible planning practices that reduce waste while supporting the UAE’s vision for a more sustainable future.', ar: 'الاستدامة جزء من كل فعالية ننظمها. نولي الأولوية للهياكل القابلة لإعادة الاستخدام والمواد القابلة للتدوير وممارسات التخطيط المسؤول التي تقلل النفايات وتدعم رؤية الإمارات لمستقبل أكثر استدامة.' },
  { selector: '.purpose-quote',     en: '“Every celebration deserves thoughtful planning, meaningful details, and an experience your guests will never forget.”', ar: '“كل احتفال يستحق تخطيطاً متأنياً وتفاصيل ذات معنى وتجربة لن ينساها ضيوفك أبداً.”' },

  // ── Footer CTA ──
  { selector: '.footer-cta-heading',   en: "Let’s Create Something Unforgettable", ar: 'لنصنع شيئاً لا يُنسى معاً' },
  { selector: '.footer-cta-paragraph', en: "Whether you’re planning a corporate event, private celebration, or brand experience, we’re ready to bring your vision to life.", ar: 'سواء كنت تخطط لفعالية مؤسسية أو احتفال خاص أو تجربة علامة تجارية، نحن جاهزون لتحقيق رؤيتك.' },
  { selector: '.footer-cta-button',    en: 'Book a Consultation', ar: 'احجز استشارة' },

  // ── Footer body ──
  { selector: '.footer-about',    en: 'AlTjawal is an Emirati event management company dedicated to creating exceptional experiences through thoughtful planning, creative design, and seamless execution. From corporate gatherings to private celebrations, we transform every vision into an unforgettable event.', ar: 'الجوال شركة إماراتية لإدارة الفعاليات متخصصة في خلق تجارب استثنائية من خلال التخطيط الدقيق والتصميم الإبداعي والتنفيذ السلس. من التجمعات المؤسسية إلى الاحتفالات الخاصة، نحول كل رؤية إلى فعالية لا تُنسى.' },
  { selector: '.footer-copyright', en: '© 2026 Al Tajwal', ar: '© 2026 الجوال' },

  // ── About Us — Hero ──
  { selector: '.aboutus-hero__heading',   en: 'Inspired by Heritage.\nDesigned for Extraordinary Experiences.', ar: 'مستوحى من التراث.\nمصمم لتجارب استثنائية.' },
  { selector: '.aboutus-hero__paragraph', en: 'Blending authentic Emirati hospitality with contemporary creativity to create meaningful events across the UAE.', ar: 'نمزج الضيافة الإماراتية الأصيلة مع الإبداع المعاصر لخلق فعاليات ذات معنى في أنحاء الإمارات.' },

  // ── About Us — Experience ──
  { selector: '.about-experience__heading', en: 'Every Great Experience Begins With A Meaningful Story.', ar: 'كل تجربة عظيمة تبدأ بقصة ذات معنى.' },

  // ── About Us — Build ──
  { selector: '.about-build__heading', en: 'We Build More Than Events', ar: 'نبني أكثر من مجرد فعاليات' },

  // ── About Us — Inspired ──
  { selector: '.about-inspired__heading', en: 'Inspired by Al Dhafra.\nRooted in the Heart of the UAE.', ar: 'مستوحى من الظفرة.\nمتجذر في قلب الإمارات.' },

  // ── About Us — Guide ──
  { selector: '.about-guide__heading', en: 'What Guides Everything We Do', ar: 'ما يوجّه كل ما نفعله' },

  // ── About Us — Founder ──
  { selector: '.about-founder__name', en: 'Meet Our Founder\nHaya Al Mansouri,\nFounder & Managing Director', ar: 'تعرّف على مؤسستنا\nهيا المنصوري،\nالمؤسسة والمديرة التنفيذية' },

  // ── Main Services — Hero ──
  { selector: '.ms-hero__heading',   en: 'Events That Bring People Together', ar: 'فعاليات تجمع الناس' },
  { selector: '.ms-hero__paragraph', en: 'From intimate celebrations to large-scale corporate gatherings, we create experiences that are thoughtfully planned, beautifully executed, and remembered long after the event ends.', ar: 'من الاحتفالات الحميمة إلى التجمعات المؤسسية الكبيرة، نصنع تجارب مخططة بعناية ومنفذة بجمال تظل في الأذهان طويلاً بعد انتهاء الفعالية.' },

  // ── Main Services — Packages ──
  { selector: '.ms-packages__heading', en: 'Packages Designed Around Your Needs', ar: 'باقات مصممة وفق احتياجاتك' },
  { selector: '.ms-packages__subtext', en: "Every event is unique. Our flexible packages provide the perfect foundation, whether you're planning an intimate gathering or a large-scale production.", ar: 'كل فعالية فريدة من نوعها. توفر باقاتنا المرنة الأساس المثالي، سواء كنت تخطط لتجمع حميم أو إنتاج فعالية كبرى.' },
  { selector: '.ms-pkg-label-1',   en: '01. BASIC',    ar: '01. أساسي' },
  { selector: '.ms-pkg-label-2',   en: '02. STANDARD', ar: '02. قياسي' },
  { selector: '.ms-pkg-label-3',   en: '03. PREMIUM',  ar: '03. مميز' },
  { selector: '.ms-pkg-tagline-1', en: 'Perfect for intimate gatherings',    ar: 'مثالي للتجمعات الحميمة' },
  { selector: '.ms-pkg-tagline-2', en: 'Ideal for mid-size events',          ar: 'مثالي للفعاليات المتوسطة الحجم' },
  { selector: '.ms-pkg-tagline-3', en: 'The complete luxury experience',     ar: 'التجربة الفاخرة الشاملة' },

  // ── Main Services — Events ──
  { selector: '.ms-events__heading',    en: 'Every Event Has A Story.', ar: 'لكل فعالية قصة.' },
  { selector: '.ms-services-label-1',  en: 'Services:', ar: 'الخدمات:' },
  { selector: '.ms-services-label-2',  en: 'Services:', ar: 'الخدمات:' },

  // ── Event Production — Hero ──
  { selector: '.ep-hero__heading',   en: 'Designing Experiences That Leave A Lasting Impression', ar: 'تصميم تجارب تترك انطباعاً دائماً' },
  { selector: '.ep-hero__paragraph', en: 'Creative production, immersive environments, and beautifully crafted event spaces designed to bring every vision to life.', ar: 'إنتاج إبداعي وبيئات غامرة وفضاءات فعاليات مصممة بجمال لإحياء كل رؤية.' },

  // ── Event Production — Creativity ──
  { selector: '.ep-creativity__heading',   en: 'Where Creativity Meets Execution', ar: 'حيث يلتقي الإبداع بالتنفيذ' },
  { selector: '.ep-creativity__subtext',   en: 'Exceptional events begin with exceptional design.', ar: 'الفعاليات الاستثنائية تبدأ بتصميم استثنائي.' },
  { selector: '.ep-creativity__paragraph', en: 'Our production team transforms ideas into immersive environments through thoughtful planning, innovative concepts, and flawless execution. From the smallest decorative detail to full-scale event production, every element is carefully curated.', ar: 'يحوّل فريق الإنتاج لدينا الأفكار إلى بيئات غامرة من خلال التخطيط الدقيق والمفاهيم المبتكرة والتنفيذ المثالي. من أدق تفاصيل الديكور إلى الإنتاج الكامل للفعاليات، يتم اختيار كل عنصر بعناية فائقة.' },

  // ── Event Production — Production & Design card ──
  { selector: '.ep-pd__card-heading',    en: 'Production & Design', ar: 'الإنتاج والتصميم' },
  { selector: '.ep-pd__card-text',       en: 'We transform ideas into immersive event experiences through creative design and innovative production solutions. From event branding, stage and booth design, exhibition stands, and floral concepts to audiovisual solutions, LED screens, interactive experiences, content creation, and professional photography and videography, we bring every vision to life with precision and creativity.', ar: 'نحوّل الأفكار إلى تجارب فعاليات غامرة من خلال التصميم الإبداعي وحلول الإنتاج المبتكرة. من هوية الفعالية وتصميم المسرح والأجنحة وأركان المعارض والمفاهيم الزهرية إلى حلول الصوت والصورة وشاشات LED والتجارب التفاعلية وإنشاء المحتوى والتصوير الاحترافي، نحقق كل رؤية بدقة وإبداع.' },
  { selector: '.ep-pd__services-label', en: 'Services:', ar: 'الخدمات:' },
  { selector: '.ep-pd__btn',            en: 'Book Now', ar: 'احجز الآن' },

  // ── Event Production — How We Work ──
  { selector: '.ep-work__heading', en: 'How We Work', ar: 'كيف نعمل' },
  { selector: '.ep-work__btn',     en: 'Book Now',    ar: 'احجز الآن' },

  // ── Branding Services — Hero ──
  { selector: '.bs-hero__heading',   en: 'Building Brands That Stand Out', ar: 'بناء علامات تجارية تبرز' },
  { selector: '.bs-hero__paragraph', en: 'Creating thoughtful visual identities that tell your story, strengthen your presence, and leave a lasting impression.', ar: 'إنشاء هويات بصرية مدروسة تحكي قصتك وتعزز حضورك وتترك انطباعاً دائماً.' },

  // ── Branding Services — Why Branding Matters ──
  { selector: '.bs-branding__heading',   en: 'Why Branding Matters?', ar: 'لماذا تهمّ العلامة التجارية؟' },
  { selector: '.bs-branding__paragraph', en: 'A strong brand creates recognition, builds trust, and forms lasting connections. Through thoughtful strategy and timeless design, we help businesses communicate with confidence and consistency across every touchpoint.', ar: 'العلامة التجارية القوية تخلق التعرف وتبني الثقة وتشكّل روابط دائمة. من خلال الاستراتيجية المدروسة والتصميم الخالد، نساعد الشركات على التواصل بثقة واتساق في كل نقطة تفاعل.' },
  { selector: '.bs-branding__btn',       en: 'Book Your Consultation Now', ar: 'احجز استشارتك الآن' },

  // ── Branding Services — More Than A Logo ──
  { selector: '.bs-logo__heading',   en: 'More Than A Logo', ar: 'أكثر من مجرد شعار' },
  { selector: '.bs-logo__subtext',   en: 'Your brand is the first impression people remember.', ar: 'علامتك التجارية هي الانطباع الأول الذي يتذكره الناس.' },
  { selector: '.bs-logo__paragraph', en: 'At AlTjawal, we create cohesive brand identities that communicate your values, connect with your audience, and help your business grow with confidence.', ar: 'في الجوال، نصنع هويات علامات تجارية متكاملة تعبّر عن قيمك وتتواصل مع جمهورك وتساعد عملك على النمو بثقة.' },
  { selector: '.bs-pkg-label-1', en: 'BRAND LAUNCH PACKAGE',   ar: 'باقة إطلاق العلامة التجارية' },
  { selector: '.bs-pkg-label-2', en: 'BRAND MAKEOVER PACKAGE', ar: 'باقة تجديد العلامة التجارية' },

  // ── FAQ — Hero ──
  { selector: '.faq-hero__label',     en: 'Everything You Need to Know', ar: 'كل ما تحتاج معرفته' },
  { selector: '.faq-hero__heading',   en: 'BEFORE WE BEGIN\nSOMETHING\nUNFORGETTABLE.', ar: 'قبل أن نبدأ\nشيئاً\nلا يُنسى.' },
  { selector: '.faq-hero__paragraph', en: "Every remarkable event begins with a conversation. We've gathered the most common questions to help you understand our process, what to expect, and how AlTjawal transforms ideas into beautifully curated experiences across the UAE.", ar: 'كل فعالية استثنائية تبدأ بمحادثة. جمعنا أكثر الأسئلة شيوعاً لمساعدتك على فهم أسلوبنا وما يمكن توقعه وكيف يحوّل الجوال الأفكار إلى تجارب منسقة بجمال في أنحاء الإمارات.' },
];

// Multi-element translations (querySelectorAll, index-matched)
export const MULTI_TRANS: { selector: string; items: Trans[] }[] = [
  // ── Tradition paragraphs ──
  {
    selector: '.tradition-paragraph',
    items: [
      { en: 'Born in Al Dhafra and proudly serving clients across all seven Emirates, AlTjawal brings together local heritage and modern creativity to deliver events that truly reflect your vision.', ar: 'ولدنا في الظفرة ونخدم بفخر عملاءنا في جميع الإمارات السبع، يجمع الجوال بين التراث المحلي والإبداع الحديث لتقديم فعاليات تعكس رؤيتك حقاً.' },
      { en: "Whether you’re planning a corporate gathering, product launch, wedding, or private celebration, our team ensures every experience feels effortless from beginning to end.", ar: 'سواء كنت تخطط لتجمع مؤسسي أو إطلاق منتج أو حفل زفاف أو احتفال خاص، يضمن فريقنا أن تكون كل تجربة سلسة من البداية إلى النهاية.' },
    ],
  },

  // ── Service labels ──
  {
    selector: '.service-label',
    items: [
      { en: 'Corporate Events',     ar: 'الفعاليات المؤسسية' },
      { en: 'Private Celebrations', ar: 'الاحتفالات الخاصة' },
      { en: 'Event Production',     ar: 'إنتاج الفعاليات' },
      { en: 'Branding Services',    ar: 'خدمات العلامة التجارية' },
    ],
  },

  // ── Choose Us bullets ──
  {
    selector: '.chooseus-item',
    items: [
      { en: 'Professional event planning from concept to completion',    ar: 'تخطيط احترافي للفعاليات من الفكرة إلى التنفيذ' },
      { en: 'Authentic Emirati hospitality with a contemporary approach', ar: 'الضيافة الإماراتية الأصيلة بأسلوب معاصر' },
      { en: 'Creative designs tailored to every occasion',               ar: 'تصاميم إبداعية مخصصة لكل مناسبة' },
      { en: 'Reliable vendor and production management',                 ar: 'إدارة موثوقة للموردين والإنتاج' },
      { en: 'Sustainable event solutions using reusable materials',      ar: 'حلول فعاليات مستدامة باستخدام مواد قابلة لإعادة الاستخدام' },
      { en: 'Personalized service with meticulous attention to detail',  ar: 'خدمة شخصية مع اهتمام دقيق بالتفاصيل' },
    ],
  },

  // ── Experience stat labels ──
  {
    selector: '.experience-label',
    items: [
      { en: 'Years of Experience', ar: 'سنوات من الخبرة' },
      { en: 'Successful Projects', ar: 'مشروع ناجح' },
      { en: 'Emirates Served',     ar: 'إمارات نخدمها' },
      { en: 'Satisfied Clients',   ar: 'عميل راضٍ' },
    ],
  },

  // ── Footer column headings ──
  {
    selector: '.footer-col-heading',
    items: [
      { en: 'Our Services', ar: 'خدماتنا' },
      { en: 'Quick Links',  ar: 'روابط سريعة' },
    ],
  },

  // ── About Us — Experience paragraphs ──
  {
    selector: '.about-experience__paragraph',
    items: [
      { en: 'AlTjawal was founded with a simple belief:\n<strong>every gathering, celebration, and milestone deserves to be experienced beautifully.</strong>', ar: 'تأسس الجوال بإيمان بسيط:\nكل تجمع واحتفال ومحطة تستحق أن تُعاش بجمال.' },
      { en: 'As an Emirati event management company, we create experiences that reflect culture, connection, and craftsmanship. Every event is thoughtfully designed to bring people together through creativity, precision, and genuine hospitality.', ar: 'بوصفنا شركة إماراتية لإدارة الفعاليات، نصنع تجارب تعكس الثقافة والتواصل والحرفية. كل فعالية مصممة بعناية لجمع الناس من خلال الإبداع والدقة والضيافة الحقيقية.' },
      { en: "Whether it's an intimate family celebration or a large-scale corporate event, we approach every project with the same dedication to excellence, ensuring every detail contributes to an unforgettable experience.", ar: 'سواء كان الأمر احتفالاً عائلياً حميمياً أو فعالية مؤسسية كبيرة، نتعامل مع كل مشروع بنفس الالتزام بالتميز، لضمان أن تُسهم كل تفصيلة في تجربة لا تُنسى.' },
    ],
  },

  // ── About Us — Build paragraphs ──
  {
    selector: '.about-build__paragraph',
    items: [
      { en: 'We build memories.\nWe build relationships.\nWe build moments that people remember long after the lights go out. Every celebration tells a story, and our role is to bring that story to life through thoughtful planning, elegant design, and flawless execution.', ar: 'نبني ذكريات.\nنبني علاقات.\nنبني لحظات يتذكرها الناس طويلاً بعد انتهاء الاحتفال. كل مناسبة تحكي قصة، ودورنا هو إحياؤها من خلال التخطيط الدقيق والتصميم الأنيق والتنفيذ المثالي.' },
      { en: '', ar: '' },
    ],
  },

  // ── About Us — Inspired paragraphs ──
  {
    selector: '.about-inspired__paragraph',
    items: [
      { en: 'Our story begins in Al Dhafra, where the beauty of endless deserts, tranquil coastlines, and authentic Emirati traditions continue to inspire everything we create.', ar: 'تبدأ قصتنا في الظفرة، حيث يواصل جمال الصحاري اللانهائية والسواحل الهادئة والتقاليد الإماراتية الأصيلة إلهام كل ما نصنع.' },
      { en: 'These landscapes shape our creative vision, influencing the way we design experiences that feel timeless, elegant, and deeply connected to the culture of the UAE.', ar: 'تُشكّل هذه المناظر رؤيتنا الإبداعية وتؤثر في الطريقة التي نصمم بها تجارب تبدو خالدة وأنيقة ومرتبطة ارتباطاً عميقاً بثقافة الإمارات.' },
    ],
  },

  // ── About Us — Guide value titles ──
  {
    selector: '.about-guide__item-title',
    items: [
      { en: 'Creativity',    ar: 'الإبداع' },
      { en: 'Excellence',    ar: 'التميز' },
      { en: 'Hospitality',   ar: 'الضيافة' },
      { en: 'Sustainability', ar: 'الاستدامة' },
    ],
  },

  // ── About Us — Guide value descriptions ──
  {
    selector: '.about-guide__item-desc',
    items: [
      { en: 'Every event begins with an original idea designed specifically for you.', ar: 'كل فعالية تبدأ بفكرة أصيلة مصممة خصيصاً لك.' },
      { en: 'We believe exceptional experiences are built through meticulous planning and attention to detail.', ar: 'نؤمن أن التجارب الاستثنائية تُبنى من خلال التخطيط الدقيق والاهتمام بالتفاصيل.' },
      { en: 'Inspired by authentic Emirati traditions, we create welcoming experiences where every guest feels valued.', ar: 'مستوحاةً من التقاليد الإماراتية الأصيلة، نصنع تجارب ترحيبية يشعر فيها كل ضيف بالتقدير.' },
      { en: "We embrace responsible event practices by prioritizing reusable materials, thoughtful production methods, and environmentally conscious solutions that support the UAE's vision for a more sustainable future.", ar: 'نتبنى ممارسات الفعاليات المسؤولة بإعطاء الأولوية للمواد القابلة لإعادة الاستخدام وأساليب الإنتاج المدروسة والحلول الصديقة للبيئة الداعمة لرؤية الإمارات نحو مستقبل أكثر استدامة.' },
    ],
  },

  // ── About Us — Founder paragraphs ──
  {
    selector: '.about-founder__paragraph',
    items: [
      { en: 'Born and raised in Al Dhafra, Haya Al Mansouri established AlTjawal with a passion for creating experiences that bring people together.', ar: 'وُلدت هيا المنصوري وترعرعت في الظفرة، وأسست الجوال بشغف لخلق تجارب تجمع الناس بعضهم ببعض.' },
      { en: 'Driven by creativity, exceptional organization, and a people-first approach, she believes every event—regardless of its size—deserves thoughtful planning, refined design, and genuine hospitality.', ar: 'مدفوعةً بالإبداع والتنظيم الاستثنائي وأسلوب يضع الإنسان في المقام الأول، تؤمن بأن كل فعالية—بصرف النظر عن حجمها—تستحق تخطيطاً متأنياً وتصميماً راقياً وضيافة حقيقية.' },
      { en: 'Today, her vision continues to shape AlTjawal into a trusted partner for businesses, families, and organizations seeking exceptional experiences across the UAE.', ar: 'اليوم، تواصل رؤيتها تشكيل الجوال ليكون شريكاً موثوقاً للشركات والعائلات والمنظمات الساعية إلى تجارب استثنائية في أنحاء الإمارات.' },
    ],
  },

  // ── Main Services — Events intro paragraphs ──
  {
    selector: '.ms-events__paragraph',
    items: [
      { en: "At AlTjawal, we believe every occasion deserves careful planning and meaningful execution. Whether you're celebrating a personal milestone or hosting a corporate event, our team manages every detail with creativity, precision, and authentic Emirati hospitality.", ar: 'في الجوال، نؤمن بأن كل مناسبة تستحق تخطيطاً دقيقاً وتنفيذاً هادفاً. سواء كنت تحتفل بإنجاز شخصي أو تستضيف فعالية مؤسسية، يدير فريقنا كل تفصيلة بإبداع ودقة وضيافة إماراتية أصيلة.' },
      { en: 'From concept development to on-site coordination, we ensure every moment unfolds effortlessly.', ar: 'من تطوير المفهوم إلى التنسيق الميداني، نضمن أن تسير كل لحظة بسلاسة تامة.' },
    ],
  },

  // ── Main Services — Event card headings ──
  {
    selector: '.ms-events__card-heading',
    items: [
      { en: 'Corporate Events',      ar: 'الفعاليات المؤسسية' },
      { en: 'Private Celebrations',  ar: 'الاحتفالات الخاصة' },
    ],
  },

  // ── Main Services — Event card body texts ──
  {
    selector: '.ms-events__card-text',
    items: [
      { en: 'We deliver professional event solutions tailored to businesses and organizations, ensuring seamless planning and flawless execution. From conferences, seminars, and product launches to corporate gatherings, networking events, and exhibition support, we manage every detail to create impactful and memorable experiences.', ar: 'نقدم حلولاً احترافية للفعاليات مصممة للشركات والمنظمات، مع ضمان التخطيط السلس والتنفيذ المثالي. من المؤتمرات والندوات وإطلاق المنتجات إلى التجمعات المؤسسية وفعاليات التواصل ودعم المعارض، ندير كل تفصيلة لخلق تجارب مؤثرة ولا تُنسى.' },
      { en: "We create unforgettable celebrations tailored to life's most special moments. From weddings, engagements, and graduation parties to birthdays, family gatherings, proposal setups, luxury picnics, and other special occasions, our team ensures every detail is thoughtfully planned and beautifully executed.", ar: 'نصنع احتفالات لا تُنسى مصممة لأكثر لحظات الحياة خصوصية. من حفلات الأعراس والخطوبة والتخرج إلى أعياد الميلاد والتجمعات العائلية وترتيبات طلب الزواج والنزهات الفاخرة وسائر المناسبات الخاصة، يضمن فريقنا أن تُخطط كل تفصيلة بعناية وتُنفذ بجمال.' },
    ],
  },

  // ── Main Services — Corporate services list ──
  {
    selector: '.ms-services-list-1 li',
    items: [
      { en: 'Conferences & Seminars',      ar: 'المؤتمرات والندوات' },
      { en: 'Product Launches',            ar: 'إطلاق المنتجات' },
      { en: 'Corporate Gatherings',        ar: 'التجمعات المؤسسية' },
      { en: 'Networking Events',           ar: 'فعاليات التواصل' },
      { en: 'Executive Meetings',          ar: 'الاجتماعات التنفيذية' },
      { en: 'Team Building Activities',    ar: 'أنشطة بناء الفريق' },
      { en: 'Employee Recognition Events', ar: 'فعاليات تقدير الموظفين' },
      { en: 'Exhibition Support',          ar: 'دعم المعارض' },
    ],
  },

  // ── Main Services — Private celebrations list ──
  {
    selector: '.ms-services-list-2 li',
    items: [
      { en: 'Weddings',            ar: 'حفلات الأعراس' },
      { en: 'Engagements',         ar: 'حفلات الخطوبة' },
      { en: 'Birthday Celebrations', ar: 'الاحتفالات بأعياد الميلاد' },
      { en: 'Graduation Parties',  ar: 'حفلات التخرج' },
      { en: 'Family Gatherings',   ar: 'التجمعات العائلية' },
      { en: 'Proposal Setups',     ar: 'ترتيبات طلب الزواج' },
      { en: 'Luxury Picnics',      ar: 'النزهات الفاخرة' },
      { en: 'Special Occasions',   ar: 'المناسبات الخاصة' },
    ],
  },

  // ── Main Services — Package items (Basic) ──
  {
    selector: '.ms-pkg-items-1 li',
    items: [
      { en: '• Up to 80 Guests',           ar: 'ما يصل إلى 80 ضيفاً' },
      { en: '• Basic Theme Design',        ar: 'تصميم موضوع أساسي' },
      { en: '• Event Day Supervision',     ar: 'إشراف يوم الفعالية' },
      { en: '• Post-Event Summary Report', ar: 'تقرير ملخص ما بعد الفعالية' },
    ],
  },

  // ── Main Services — Package items (Standard) ──
  {
    selector: '.ms-pkg-items-2 li',
    items: [
      { en: '• Up to 150 Guests',          ar: 'ما يصل إلى 150 ضيفاً' },
      { en: '• Custom Theme & Décor',      ar: 'موضوع وديكور مخصص' },
      { en: '• Full-Day Coordination',     ar: 'تنسيق طوال اليوم' },
      { en: '• Vendor Management',         ar: 'إدارة الموردين' },
      { en: '• Photography Coverage',      ar: 'تغطية تصويرية' },
      { en: '• Post-Event Summary Report', ar: 'تقرير ملخص ما بعد الفعالية' },
    ],
  },

  // ── Main Services — Package items (Premium) ──
  {
    selector: '.ms-pkg-items-3 li',
    items: [
      { en: '• Unlimited Guests',           ar: 'ضيوف غير محدودين' },
      { en: '• Bespoke Theme & Design',     ar: 'موضوع وتصميم بمواصفات خاصة' },
      { en: '• Dedicated Event Manager',    ar: 'مدير فعالية مخصص' },
      { en: '• Full Vendor Coordination',   ar: 'تنسيق متكامل مع الموردين' },
      { en: '• Luxury Décor Package',       ar: 'باقة ديكور فاخرة' },
      { en: '• Photography & Videography',  ar: 'التصوير الفوتوغرافي والمرئي' },
      { en: '• Post-Event Summary Report',  ar: 'تقرير ملخص ما بعد الفعالية' },
    ],
  },

  // ── Main Services — Package Book Now buttons ──
  {
    selector: '.ms-packages__btn',
    items: [
      { en: 'Book Now', ar: 'احجز الآن' },
      { en: 'Book Now', ar: 'احجز الآن' },
      { en: 'Book Now', ar: 'احجز الآن' },
    ],
  },

  // ── Main Services — Events Book Now buttons ──
  {
    selector: '.ms-events__btn',
    items: [
      { en: 'Book Now', ar: 'احجز الآن' },
      { en: 'Book Now', ar: 'احجز الآن' },
    ],
  },

  // ── Event Production — Production & Design services list ──
  {
    selector: '.ep-pd__services-list li',
    items: [
      { en: 'Event Branding & Themes',           ar: 'هوية وموضوعات الفعالية' },
      { en: 'Stage & Booth Design',              ar: 'تصميم المسرح والأجنحة' },
      { en: 'Exhibition Stands',                 ar: 'أركان المعارض' },
      { en: 'Floral Concepts',                   ar: 'المفاهيم الزهرية' },
      { en: 'Backdrops & Installations',         ar: 'الخلفيات والتركيبات' },
      { en: 'Audio Visual Solutions',            ar: 'حلول الصوت والصورة' },
      { en: 'LED Screens',                       ar: 'شاشات LED' },
      { en: 'Interactive Experiences',           ar: 'التجارب التفاعلية' },
      { en: 'Event Content Creation',            ar: 'إنشاء محتوى الفعاليات' },
      { en: 'Event Photography & Videography',   ar: 'التصوير الفوتوغرافي والمرئي للفعاليات' },
    ],
  },

  // ── Event Production — How We Work steps ──
  {
    selector: '.ep-work__step-label',
    items: [
      { en: 'Discover', ar: 'اكتشف' },
      { en: 'Design',   ar: 'صمّم' },
      { en: 'Produce',  ar: 'أنتج' },
      { en: 'Deliver',  ar: 'سلّم' },
    ],
  },
  {
    selector: '.ep-work__step-desc',
    items: [
      { en: 'Understanding your vision and objectives.',     ar: 'فهم رؤيتك وأهدافك.' },
      { en: 'Creating concepts tailored to your event.',     ar: 'إنشاء مفاهيم مصممة لفعاليتك.' },
      { en: 'Managing every production detail.',             ar: 'إدارة كل تفصيلة إنتاجية.' },
      { en: 'Executing flawlessly from start to finish.',    ar: 'تنفيذ مثالي من البداية إلى النهاية.' },
    ],
  },

  // ── Branding Services — Brand Launch package items ──
  {
    selector: '.bs-pkg-items-1 li',
    items: [
      { en: '• Brand Strategy',              ar: 'استراتيجية العلامة التجارية' },
      { en: '• Primary Logo',                ar: 'الشعار الأساسي' },
      { en: '• Secondary Logo',              ar: 'الشعار الثانوي' },
      { en: '• Color Palette',               ar: 'لوحة الألوان' },
      { en: '• Typography Selection',        ar: 'اختيار الخطوط' },
      { en: '• Social Media Guidelines',     ar: 'إرشادات وسائل التواصل الاجتماعي' },
      { en: '• Brand Guidelines Document',   ar: 'وثيقة إرشادات العلامة التجارية' },
      { en: '• Business Card Design',        ar: 'تصميم بطاقة العمل' },
    ],
  },

  // ── Branding Services — Brand Makeover package items ──
  {
    selector: '.bs-pkg-items-2 li',
    items: [
      { en: '• Brand Audit & Strategy',      ar: 'تدقيق واستراتيجية العلامة التجارية' },
      { en: '• Logo Redesign',               ar: 'إعادة تصميم الشعار' },
      { en: '• Updated Color Palette',       ar: 'لوحة ألوان محدّثة' },
      { en: '• New Typography System',       ar: 'نظام خطوط جديد' },
      { en: '• Refreshed Brand Assets',      ar: 'أصول علامة تجارية منقّحة' },
      { en: '• Brand Guidelines Update',     ar: 'تحديث إرشادات العلامة التجارية' },
    ],
  },

  // ── Branding Services — Package Book Now buttons ──
  {
    selector: '.bs-logo__pkg-btn',
    items: [
      { en: 'Book Now', ar: 'احجز الآن' },
      { en: 'Book Now', ar: 'احجز الآن' },
    ],
  },

  // ── Footer links (services col first, then quick links col) ──
  {
    selector: '.footer-link',
    items: [
      { en: 'Corporate Events',    ar: 'الفعاليات المؤسسية' },
      { en: 'Private Events',      ar: 'الفعاليات الخاصة' },
      { en: 'Event Packages',      ar: 'باقات الفعاليات' },
      { en: 'Production & Design', ar: 'الإنتاج والتصميم' },
      { en: 'Branding Services',   ar: 'خدمات العلامة التجارية' },
      { en: 'Home',       ar: 'الرئيسية' },
      { en: 'About Us',   ar: 'من نحن' },
      { en: 'FAQ',        ar: 'الأسئلة الشائعة' },
      { en: 'Contact Us', ar: 'اتصل بنا' },
      { en: 'Legal',      ar: 'قانوني' },
    ],
  },
];

// Navbar labels (used directly in Navbar component via context)
export const NAV = {
  about:           { en: 'About',           ar: 'من نحن' },
  services:        { en: 'Services',        ar: 'الخدمات' },
  mainServices:    { en: 'Main Services',   ar: 'الخدمات الرئيسية' },
  eventProduction: { en: 'Event Production',ar: 'إنتاج الفعاليات' },
  branding:        { en: 'Branding Services', ar: 'خدمات العلامة التجارية' },
  contact:         { en: 'Contact Us',      ar: 'اتصل بنا' },
  bookNow:         { en: 'Book Now',        ar: 'احجز الآن' },
};
