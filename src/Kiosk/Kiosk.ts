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
      await this.context.assetsStorage().then(async (ability: IAssetsStorageAbility) => {
        for (const category of this.context.slide.data.categories) {
            for (const folder of category.folders) {
                console.log("medias", folder.medias)
                for (const media of folder.medias) {
                  try {
                    console.log("Downloading", media.url)
                    await ability.downloadAndGet(media.url, {noRetry: true},)
                  } catch(e) {
                    console.log("error")
                    console.error(e);
                  }
                }
            }
        }
      })
      return true;
  };

  setup(props: Record<string, any>, vue: VueInstance, context: ISlideContext) {
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
