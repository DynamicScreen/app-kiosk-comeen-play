import {
    ISlideContext,
    IPublicSlide,
    SlideModule,
    VueInstance, IAssetsStorageAbility
} from "@comeen/comeen-play-sdk-js";
import Home from "./components/Home";
import FolderLayout from "./components/FolderLayout";
import {Category, Categories} from "./KioskOptions";

export type CategoryWithId = Category & {
    uid: number
}

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
    const { h, reactive, ref, computed } = vue;

    const slide = reactive(props.slide) as IPublicSlide;
    this.context = reactive(props.slide.context);

    window.kiosk = {
        vue: vue,
        t: this.t,
        context: context
    }

    const selectCategory = ref<CategoryWithId | null>(null);
    const isOnHome = ref(true);

    const categories = computed(() => {
        return slide.data.categories.map((category) => {
            category['uid'] = Math.random();
            return category;
        })
    });
    const selectCategoryId = computed(() => {
        return selectCategory.value?.uid ?? -1
    })

    const gotoCategory = (category: CategoryWithId) => {
        console.log("GO TO CATEGORY")
        isOnHome.value = false;
        selectCategory.value = category;
    }

    const gotoHome = () => {
        isOnHome.value = true;
        selectCategory.value = null;
    }

    this.context.onPrepare(async () => {
    });

      return () =>
          h("div", {
              class: "flex w-full h-full bg-gray-50"
          }, [
              isOnHome.value ? h(Home, {
                  categories: categories.value,
                  onOpenCategory: (category) => gotoCategory(category)
              }) : h(FolderLayout, {
                  categories: categories.value,
                  selectedCategoryId: selectCategoryId.value,
                  onOpenCategory: (category) => gotoCategory(category),
                  onCloseCategory: () => gotoHome()
              }),
          ])
  }
}
