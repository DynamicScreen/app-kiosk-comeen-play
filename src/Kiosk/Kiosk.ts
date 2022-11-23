import {
    ISlideContext,
    IPublicSlide,
    SlideModule,
    VueInstance, IAssetsStorageAbility
} from "@comeen/comeen-play-sdk-js";

export default class KioskSlideModule extends SlideModule {
  constructor(context: ISlideContext) {
    super(context);
  }

  async onReady() {
      for (const category of this.context.slide.data.categories) {
          for (const folder of category.folders) {
              for (const media of folder.medias) {
                  await this.context.assetsStorage().then(async (ability: IAssetsStorageAbility) => {
                      await ability.downloadAndGet(media.url, {noRetry: false},)
                  })
              }
          }
      }
      return true;
  };

  setup(props: Record<string, any>, vue: VueInstance, context: ISlideContext) {
const en = require("/Users/nicolas/Desktop/DS/app-server/storage/apps//app-kiosk-comeen-play/0.2.0/languages/en.json");
const fr = require("/Users/nicolas/Desktop/DS/app-server/storage/apps//app-kiosk-comeen-play/0.2.0/languages/fr.json");
const translator: any = this.context.translator;
translator.addResourceBundle('en', 'kiosk', en);
translator.addResourceBundle('fr', 'kiosk', fr);
this.t = (key: string, namespace: string = 'kiosk') => translator.t(key, {ns: namespace});

    const { h, reactive, ref } = vue;

    const slide = reactive(props.slide) as IPublicSlide;
    this.context = reactive(props.slide.context);

    const categories = ref(slide.data.categories);

    this.context.onPrepare(async () => {
    });

    return () =>
      h("div", {
        class: "flex w-full h-full"
      }, "COUCOU JE SUIS là")
  }
}
