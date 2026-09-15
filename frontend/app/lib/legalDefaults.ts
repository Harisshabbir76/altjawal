export type LegalSection = { title: string; body: string; titleAr?: string; bodyAr?: string };

export const DEFAULT_PRIVACY_AR: LegalSection[] = [
  {
    title: 'خصوصيتك تهمنا',
    body: 'في الجوال، نحترم خصوصيتك ونلتزم بحماية المعلومات الشخصية التي تشاركها معنا. توضح سياسة الخصوصية هذه كيف نجمع معلوماتك ونستخدمها ونحافظ عليها عند زيارة موقعنا الإلكتروني أو التعامل مع خدماتنا.',
  },
  {
    title: 'المعلومات التي نجمعها',
    body: 'قد نجمع المعلومات التي تقدمها طوعاً، بما في ذلك:\n• الاسم الكامل\n• عنوان البريد الإلكتروني\n• رقم الهاتف\n• اسم الشركة (إن وجد)\n• تفاصيل الفعالية\n• الرسائل المرسلة عبر نماذج الاتصال\nقد نجمع أيضاً معلومات تقنية مثل:\n• عنوان IP\n• نوع المتصفح\n• معلومات الجهاز\n• بيانات استخدام الموقع\n• ملفات تعريف الارتباط ومعلومات التحليلات',
  },
  {
    title: 'كيف نستخدم معلوماتك',
    body: 'تساعدنا معلوماتك في:\n• الرد على استفساراتك\n• إعداد عروض الأسعار والمقترحات\n• تقديم خدمات إدارة الفعاليات\n• تحسين موقعنا وتجربة المستخدم\n• إرسال تحديثات ذات صلة باستفسارك\n• الامتثال للالتزامات القانونية\nلا نبيع أبداً معلوماتك الشخصية.',
  },
  {
    title: 'مشاركة المعلومات',
    body: 'نشارك معلوماتك فقط عند الضرورة، بما في ذلك:\n• الموردون الموثوقون المشاركون في تنفيذ فعاليتك\n• مزودو الخدمات الداعمون لموقعنا\n• الجهات القانونية حيثما يستوجب ذلك القانون',
  },
  {
    title: 'أمان البيانات',
    body: 'نطبق تدابير أمنية مناسبة لحماية معلوماتك من الوصول غير المصرح به أو إساءة الاستخدام أو الإفصاح. بينما لا يوجد نظام إلكتروني آمن تماماً، نعمل باستمرار على حماية بياناتك الشخصية.',
  },
  {
    title: 'حقوقك',
    body: 'يمكنك طلب:\n• الوصول إلى معلوماتك الشخصية\n• تصحيح المعلومات غير الدقيقة\n• طلب حذف بياناتك\n• سحب موافقتك حيثما ينطبق ذلك\nللتقديم بطلب، يرجى التواصل معنا مباشرة.',
  },
  {
    title: 'روابط طرف ثالث',
    body: 'قد يتضمن موقعنا روابط لمواقع خارجية أو منصات التواصل الاجتماعي. لسنا مسؤولين عن ممارسات الخصوصية لمواقع الطرف الثالث.',
  },
  {
    title: 'تحديثات السياسة',
    body: 'قد تُحدَّث سياسة الخصوصية هذه دورياً. تسري التغييرات فور نشرها على هذه الصفحة.',
  },
  {
    title: 'التواصل',
    body: 'إذا كانت لديك أي أسئلة بشأن سياسة الخصوصية هذه، يرجى التواصل معنا.',
  },
];

export const DEFAULT_TERMS_AR: LegalSection[] = [
  {
    title: 'قبول الشروط',
    body: 'بالوصول إلى موقع الجوال أو استخدامه، فأنت توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق، يرجى عدم استخدام موقعنا أو خدماتنا.',
  },
  {
    title: 'خدماتنا',
    body: 'يقدم الجوال خدمات إدارة الفعاليات والتخطيط لها في أنحاء الإمارات. جميع الخدمات رهينة بالتوافر وتخضع لاتفاقيات خدمة منفصلة بين الجوال والعميل.',
  },
  {
    title: 'الملكية الفكرية',
    body: 'جميع المحتويات على هذا الموقع — بما في ذلك النصوص والصور والرسومات والشعارات والتصاميم — هي ملك للجوال ومحمية بموجب قوانين حقوق النشر والملكية الفكرية المعمول بها. لا يجوز إعادة إنتاج أي محتوى أو توزيعه دون إذن كتابي مسبق.',
  },
  {
    title: 'سلوك المستخدم',
    body: 'عند استخدام موقعنا أو التواصل معنا، توافق على عدم:\n• تقديم معلومات كاذبة أو مضللة\n• محاولة الوصول غير المصرح به إلى أنظمتنا\n• استخدام الموقع لأي غرض غير قانوني\n• تعطيل أو التدخل في عمل موقعنا',
  },
  {
    title: 'تحديد المسؤولية',
    body: 'لا يتحمل الجوال المسؤولية عن أي أضرار غير مباشرة أو عرضية أو تبعية ناجمة عن استخدام موقعنا أو خدماتنا. لا نقدم أي ضمانات بشأن دقة أو اكتمال المعلومات الواردة في هذا الموقع.',
  },
  {
    title: 'الحجوزات والمدفوعات',
    body: 'تخضع جميع حجوزات الفعاليات لاتفاقية رسمية وعربون. تُحدد شروط الإلغاء واسترداد المبالغ في عقد الخدمة الفردي الخاص بك. يحتفظ الجوال بالحق في رفض أي حجز وفق تقديره.',
  },
  {
    title: 'القانون الحاكم',
    body: 'تخضع هذه الشروط والأحكام لقوانين دولة الإمارات العربية المتحدة. وتخضع أي نزاعات لاختصاص المحاكم في الإمارات.',
  },
  {
    title: 'التغييرات على الشروط',
    body: 'نحتفظ بالحق في تحديث هذه الشروط والأحكام في أي وقت. يُعدّ الاستمرار في استخدام الموقع بعد نشر التغييرات قبولاً للشروط المعدّلة.',
  },
  {
    title: 'التواصل',
    body: 'لأي أسئلة تتعلق بهذه الشروط والأحكام، يرجى التواصل معنا عبر صفحة الاتصال.',
  },
];

export const DEFAULT_COOKIE_AR: LegalSection[] = [
  {
    title: 'ما هي ملفات تعريف الارتباط',
    body: 'ملفات تعريف الارتباط هي ملفات نصية صغيرة تُخزَّن على جهازك عند زيارة موقع إلكتروني. تساعدنا في فهم كيفية تفاعل الزوار مع موقعنا وتحسين تجربة التصفح لديك.',
  },
  {
    title: 'كيف نستخدم ملفات تعريف الارتباط',
    body: 'يستخدم الجوال ملفات تعريف الارتباط للأغراض التالية:\n• ملفات تعريف الارتباط الأساسية لضمان عمل الموقع بشكل صحيح\n• ملفات تعريف الارتباط التحليلية لفهم سلوك الزوار وتحسين موقعنا\n• ملفات تعريف الارتباط التفضيلية لتذكر إعداداتك وخياراتك',
  },
  {
    title: 'ملفات تعريف الارتباط لطرف ثالث',
    body: 'قد نستخدم خدمات طرف ثالث مثل Google Analytics التي تضع ملفات تعريف الارتباط الخاصة بها على جهازك. وتخضع هذه للسياسات الخاصة بالطرف الثالث المعني.',
  },
  {
    title: 'إدارة ملفات تعريف الارتباط',
    body: 'يمكنك التحكم في ملفات تعريف الارتباط أو تعطيلها من خلال إعدادات متصفحك. يُرجى ملاحظة أن تعطيل بعض ملفات تعريف الارتباط قد يؤثر على وظائف موقعنا. ارجع إلى وثائق مساعدة متصفحك للاطلاع على تعليمات إدارة ملفات تعريف الارتباط.',
  },
  {
    title: 'الموافقة',
    body: 'باستمرارك في استخدام موقعنا، فأنت توافق على استخدام ملفات تعريف الارتباط كما هو موضح في هذه السياسة. إذا كنت لا توافق، يرجى ضبط إعدادات متصفحك أو الامتناع عن استخدام موقعنا.',
  },
  {
    title: 'تحديثات السياسة',
    body: 'قد تُحدَّث سياسة ملفات تعريف الارتباط هذه من وقت لآخر. ستُنشر أي تغييرات على هذه الصفحة وتسري فور نشرها.',
  },
  {
    title: 'التواصل',
    body: 'إذا كانت لديك أسئلة حول استخدامنا لملفات تعريف الارتباط، يرجى التواصل معنا عبر صفحة الاتصال.',
  },
];

export const DEFAULT_PRIVACY: LegalSection[] = [
  {
    title: 'Your Privacy Matters',
    body: 'At AlTjawal, we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or engage with our services.',
  },
  {
    title: 'Information We Collect',
    body: 'We may collect information you voluntarily provide, including:\n• Full Name\n• Email Address\n• Phone Number\n• Company Name (if applicable)\n• Event Details\n• Messages submitted through our contact forms\nWe may also collect technical information such as:\n• IP Address\n• Browser Type\n• Device Information\n• Website Usage Data\n• Cookies and Analytics Information',
  },
  {
    title: 'How We Use Your Information',
    body: 'Your information helps us:\n• Respond to your inquiries\n• Prepare quotations and proposals\n• Deliver our event management services\n• Improve our website and user experience\n• Send relevant updates regarding your inquiry\n• Comply with legal obligations\nWe never sell your personal information.',
  },
  {
    title: 'Information Sharing',
    body: 'We only share your information when necessary, including:\n• Trusted vendors involved in delivering your event\n• Service providers supporting our website\n• Legal authorities where required by law',
  },
  {
    title: 'Data Security',
    body: 'We implement appropriate security measures to protect your information against unauthorized access, misuse, or disclosure. While no online system is completely secure, we continuously work to safeguard your personal data.',
  },
  {
    title: 'Your Rights',
    body: 'You may request to:\n• Access your personal information\n• Correct inaccurate information\n• Request deletion of your data\n• Withdraw your consent where applicable\nTo make a request, please contact us directly.',
  },
  {
    title: 'Third-Party Links',
    body: 'Our website may include links to external websites or social media platforms. We are not responsible for the privacy practices of third-party websites.',
  },
  {
    title: 'Policy Updates',
    body: 'This Privacy Policy may be updated periodically. Changes become effective once published on this page.',
  },
  {
    title: 'Contact',
    body: 'If you have any questions regarding this Privacy Policy, please contact us.',
  },
];

export const DEFAULT_TERMS: LegalSection[] = [
  {
    title: 'Acceptance of Terms',
    body: 'By accessing or using the AlTjawal website, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our website or services.',
  },
  {
    title: 'Our Services',
    body: 'AlTjawal provides event management and planning services across the UAE. All services are subject to availability and separate service agreements between AlTjawal and the client.',
  },
  {
    title: 'Intellectual Property',
    body: 'All content on this website — including text, images, graphics, logos, and designs — is the property of AlTjawal and is protected under applicable copyright and intellectual property laws. You may not reproduce or distribute any content without prior written permission.',
  },
  {
    title: 'User Conduct',
    body: 'When using our website or contacting us, you agree not to:\n• Submit false or misleading information\n• Attempt to gain unauthorized access to our systems\n• Use the website for any unlawful purpose\n• Disrupt or interfere with the functioning of our website',
  },
  {
    title: 'Limitation of Liability',
    body: 'AlTjawal is not liable for any indirect, incidental, or consequential damages arising from the use of our website or services. We make no warranties regarding the accuracy or completeness of the information provided on this site.',
  },
  {
    title: 'Bookings & Payments',
    body: 'All event bookings are subject to a formal agreement and deposit. Cancellation and refund terms are outlined in your individual service contract. AlTjawal reserves the right to decline any booking at its discretion.',
  },
  {
    title: 'Governing Law',
    body: 'These Terms & Conditions are governed by the laws of the United Arab Emirates. Any disputes shall be subject to the jurisdiction of the courts in the UAE.',
  },
  {
    title: 'Changes to Terms',
    body: 'We reserve the right to update these Terms & Conditions at any time. Continued use of the website after changes are posted constitutes acceptance of the revised terms.',
  },
  {
    title: 'Contact',
    body: 'For any questions regarding these Terms & Conditions, please reach out to us through our contact page.',
  },
];

export const DEFAULT_COOKIE: LegalSection[] = [
  {
    title: 'What Are Cookies',
    body: 'Cookies are small text files stored on your device when you visit a website. They help us understand how visitors interact with our site and improve your browsing experience.',
  },
  {
    title: 'How We Use Cookies',
    body: 'AlTjawal uses cookies for the following purposes:\n• Essential cookies to ensure the website functions correctly\n• Analytics cookies to understand visitor behaviour and improve our site\n• Preference cookies to remember your settings and choices',
  },
  {
    title: 'Third-Party Cookies',
    body: "We may use third-party services such as Google Analytics that place their own cookies on your device. These are governed by the respective third party's privacy and cookie policies.",
  },
  {
    title: 'Managing Cookies',
    body: "You can control or disable cookies through your browser settings. Please note that disabling certain cookies may affect the functionality of our website. Refer to your browser's help documentation for instructions on managing cookies.",
  },
  {
    title: 'Consent',
    body: 'By continuing to use our website, you consent to the use of cookies as described in this policy. If you do not agree, please adjust your browser settings or refrain from using our website.',
  },
  {
    title: 'Policy Updates',
    body: 'This Cookie Policy may be updated from time to time. Any changes will be posted on this page and take effect immediately upon publication.',
  },
  {
    title: 'Contact',
    body: 'If you have questions about our use of cookies, please contact us through our contact page.',
  },
];

export const DEFAULT_LEGAL_SECTIONS: LegalSection[] = [
  {
    title: 'Website Use',
    body: 'The content on this website is provided for general information about Atjwal Events, our services, projects, and capabilities. While we aim to keep all information accurate and up to date, details may change without prior notice.',
    titleAr: 'استخدام الموقع',
    bodyAr: 'يتم توفير المحتوى على هذا الموقع لمعلومات عامة عن فعاليات الجوال، وخدماتنا، ومشاريعنا، وإمكانياتنا. بينما نهدف إلى الحفاظ على دقة وتحديث كافة المعلومات، قد تتغير التفاصيل دون إشعار مسبق.',
  },
  {
    title: 'Our Services',
    body: 'Atjwal Events provides services including local events, entertainment, exhibitions, event management, production, and branding. Specific services, deliverables, timelines, and pricing are subject to the quotation or agreement approved by the client.',
    titleAr: 'خدماتنا',
    bodyAr: 'تقدم فعاليات الجوال خدمات تشمل الفعاليات المحلية، والترفيه، والمعارض، وإدارة الفعاليات، والإنتاج، والهوية المؤسسية. تخضع الخدمات المحددة والمخرجات والجداول الزمنية والأسعار لعرض السعر أو الاتفاقية المعتمدة من قبل العميل.',
  },
  {
    title: 'Intellectual Property',
    body: 'All content on this website, including logos, names, graphics, images, designs, text, and other creative materials, belongs to Atjwal Events or is used with permission. No content may be copied, reproduced, modified, or used commercially without prior written approval.',
    titleAr: 'الملكية الفكرية',
    bodyAr: 'جميع المحتويات الموجودة على هذا الموقع، بما في ذلك الشعارات والأسماء والرسومات والصور والتصاميم والنصوص والمواد الإبداعية الأخرى، تعود لفعاليات الجوال أو تُستخدم بإذن. لا يجوز نسخ أي محتوى أو إعادة إنتاجه أو تعديله أو استخدامه تجارياً دون موافقة خطية مسبقة.',
  },
  {
    title: 'Client Projects',
    body: 'Images, videos, and other materials from events or projects may be displayed on our website and social media for portfolio and promotional purposes, where permitted. Any specific client confidentiality or usage restrictions will be respected according to the agreed terms.',
    titleAr: 'مشاريع العملاء',
    bodyAr: 'قد يتم عرض الصور ومقاطع الفيديو والمواد الأخرى من الفعاليات أو المشاريع على موقعنا الإلكتروني ووسائل التواصل الاجتماعي لأغراض ملف الأعمال والترويج، حيثما يُسمح بذلك. سيتم احترام أي سرية محددة للعميل أو قيود الاستخدام وفقاً للشروط المتفق عليها.',
  },
  {
    title: 'Third-Party Links & Services',
    body: 'Our website or projects may include references to third-party websites, suppliers, venues, platforms, or service providers. Atjwal Events is not responsible for the content, availability, or policies of third-party websites or services.',
    titleAr: 'روابط وخدمات الأطراف الثالثة',
    bodyAr: 'قد يتضمن موقعنا أو مشاريعنا إشارات إلى مواقع إلكترونية أو موردين أو أماكن أو منصات أو مزودي خدمات من أطراف ثالثة. لا تتحمل فعاليات الجوال المسؤولية عن محتوى أو توافر أو سياسات المواقع أو الخدمات الخاصة بأطراف ثالثة.',
  },
  {
    title: 'Payments & Bookings',
    body: 'All project payments, deposits, cancellation terms, and other commercial conditions are governed by the approved quotation, proposal, or agreement between Atjwal Events and the client.',
    titleAr: 'المدفوعات والحجوزات',
    bodyAr: 'تخضع جميع مدفوعات المشاريع، والودائع، وشروط الإلغاء، والظروف التجارية الأخرى لعرض السعر أو المقترح أو الاتفاقية المعتمدة بين فعاليات الجوال والعميل.',
  },
  {
    title: 'Privacy',
    body: 'Any information submitted through our website or contact forms will be handled for the purpose of responding to enquiries, providing services, and communicating with clients. We do not intentionally collect personal information beyond what is reasonably required for these purposes.',
    titleAr: 'الخصوصية',
    bodyAr: 'سيتم التعامل مع أي معلومات يتم إرسالها عبر موقعنا الإلكتروني أو نماذج الاتصال لغرض الرد على الاستفسارات، وتقديم الخدمات، والتواصل مع العملاء. نحن لا نجمع عن عمد معلومات شخصية تتجاوز ما هو مطلوب بشكل معقول لهذه الأغراض.',
  },
  {
    title: 'Disclaimer',
    body: 'Atjwal Events makes reasonable efforts to ensure the information provided on this website is accurate. However, we do not guarantee that the website or its content will always be complete, current, or free from errors.',
    titleAr: 'إخلاء المسؤولية',
    bodyAr: 'تبذل فعاليات الجوال جهوداً معقولة لضمان دقة المعلومات المقدمة على هذا الموقع. ومع ذلك، فإننا لا نضمن أن الموقع أو محتواه سيكون دائماً كاملاً أو محدثاً أو خالياً من الأخطاء.',
  },
  {
    title: 'Changes',
    body: 'Atjwal Events reserves the right to update, modify, or remove website content and these legal terms at any time without prior notice.',
    titleAr: 'التغييرات',
    bodyAr: 'تحتفظ فعاليات الجوال بالحق في تحديث أو تعديل أو إزالة محتوى الموقع وهذه الشروط القانونية في أي وقت دون إشعار مسبق.',
  },
  {
    title: 'Contact',
    body: 'For any questions regarding our legal terms, services, or website, please contact the Atjwal Events team through the contact details provided on this website.',
    titleAr: 'التواصل',
    bodyAr: 'لأي أسئلة تتعلق بشروطنا القانونية أو خدماتنا أو موقعنا، يرجى التواصل مع فريق فعاليات الجوال من خلال تفاصيل الاتصال الموضحة على هذا الموقع.',
  },
];

