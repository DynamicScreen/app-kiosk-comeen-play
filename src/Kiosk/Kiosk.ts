import {
    ISlideContext,
    IPublicSlide,
    SlideModule,
    VueInstance, IAssetsStorageAbility
} from "@comeen/comeen-play-sdk-js";
import Home from "./components/Home";
import {computed} from "vue";
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
    const { h, reactive, ref } = vue;

    const slide = reactive(props.slide) as IPublicSlide;
    this.context = reactive(props.slide.context);

    const selectCategory = ref<CategoryWithId | null>(null);
    const isOnHome = ref(true);
    const isOnCategory = ref(false);

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
                  "onUpdate:openCategory": (category) => gotoCategory(category)
              }) : h(FolderLayout, {
                  categories: categories.value,
                  selectedCategoryId: selectCategoryId.value,
                  "onUpdate:returnToHome": () => gotoHome()
              }),
          ])
  }
}
