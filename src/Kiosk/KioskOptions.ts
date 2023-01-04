import {
  ISlideOptionsContext,
  SlideOptionsModule, VueInstance
} from "@comeen/comeen-play-sdk-js";
import CategoryForm from "./components/CategoryForm";
import { colorClasses } from "./utils/_Colors";

export type Category = {
  icon: string
  name: string
  type: string
  color: string
  links?: Link[]
  folders?: string[]
}
export type Link = {
  icon: string
  name: string
  url: string
}
export type Categories = Category[]

export default class KioskOptionsModule extends SlideOptionsModule {
  constructor(context: ISlideOptionsContext) {
    super(context);
  }

  async onReady() {
    return true;
  };

  setup(props: Record<string, any>, vue: VueInstance, context: ISlideOptionsContext) {
    const en = require("/home/scleriot/Dev/dynamicscreen/app-server/storage/apps//app-kiosk-comeen-play/0.2.0/languages/en.json");
    const fr = require("/home/scleriot/Dev/dynamicscreen/app-server/storage/apps//app-kiosk-comeen-play/0.2.0/languages/fr.json");
    const translator: any = this.context.translator;
    translator.addResourceBundle('en', 'kiosk', en);
    translator.addResourceBundle('fr', 'kiosk', fr);
    this.t = (key: string, namespace: string = 'kiosk') => translator.t(key, { ns: namespace });

    const { h, ref, computed, toRefs, watch } = vue;
    const update = context.update;

    const isFormOpen = ref<boolean>(false);
    const categories = ref(update.option('categories').modelValue ?? []);

    const editCategory = ref<Category | null>(null);
    const editKey = ref<number | undefined>(undefined);

    const { Field, TextInput, MediaPicker, NumberInput, Button } = this.context.components;

    const saveCategory = (emitValue: { category: Category, key: number | undefined }) => {
      if (emitValue.key !== undefined && emitValue.key >= 0) {
        categories.value[emitValue.key] = emitValue.category;
      } else categories.value.push(emitValue.category);
      isFormOpen.value = false;
    }

    const deleteCategory = (key: number) => {
      categories.value.splice(key, 1);
      isFormOpen.value = false;
    }

    const close = () => {
      isFormOpen.value = false;
      editCategory.value = null;
      editKey.value = undefined;
    }

    const renderCategory = (category, key: number) => {
      if (category.folders && !Array.isArray(category.folders)) {
        category.folders = JSON.parse(category.folders);
      }
      if (category.links && !Array.isArray(category.links)) {
        category.links = JSON.parse(category.links);
      }
      return h("div", {
        class: "h-10 w-auto pl-3 width flex justify-between rounded border-2 transition hover:-translate-y-1 duration-300 hover:cursor-pointer items-center " + `text-${colorClasses[category.color]} border-${colorClasses[category.color]}`,
        onClick: () => {
          editCategory.value = category;
          editKey.value = key;
          isFormOpen.value = true
        }
      }, [
        h("div", {
          class: "space-x-3 flex flex-row items-center"
        }, [
          h("i", { class: category.icon }),
          h("span", {
            class: ""
          }, category.name)
        ]),
        h("div", {
          class: `w-8 flex items-center justify-center h-full bg-${colorClasses[category.color]}`
        }, [
          h("i", {
            class: "fa fa-pen text-sm text-white"
          })
        ])
      ])
    }

    watch(categories, (newValue) => {
      update.option('categories')["onUpdate:modelValue"](newValue.map((category: Category) => ({
        ...category,
        folders: JSON.stringify(category.folders),
        links: JSON.stringify(category.links),
      })));
    }, { deep: true })

    return () => [
      h(Field, { label: this.t('modules.kiosk.options.new_document_date') }, [
        h("div", {
          class: "flex flex-row items-center space-x-2"
        }, [
          h(NumberInput, {
            min: 1, max: 100, default: 5, ...update.option("notification_duration"),
            class: "w-1/4"
          }),
          h("span", {
            class: "text-sm"
          }, this.t("modules.kiosk.options.days"))
        ]),
        h("span", {
          class: "text-xs text-gray-400"
        }, this.t("modules.kiosk.options.new_document_date_desc"))
      ]),
      h(Field, { label: this.t('modules.kiosk.options.notification_time') }, [
        h(TextInput, {
          mask: "##:##",
          class: "w-1/6",
          placeholder: "00:00",
          ...update.option("notification_time")
        })
      ]),
      h(Field, { label: this.t('modules.kiosk.options.background_image') }, [
        h(MediaPicker, { type: 'image', ...update.option("background_img") }),
        h("span", {
          class: "text-xs text-gray-400"
        }, this.t('modules.kiosk.options.background_warning'))
      ]),
      h(Field, { label: this.t('modules.kiosk.options.category') }, [
        h("div", {
          class: "flex grid grid-cols-2 gap-4 mt-2 justify-between w-full"
        }, [
          categories.value.length > 0 ?
            categories.value.map((category, key) => renderCategory(category, key))
            :
            h("span", { class: "font-light text-gray-400" }, this.t("modules.kiosk.options.no_categories"))
        ]),
      ]),
      h(CategoryForm, {
        formComponents: this.context.components,
        open: isFormOpen.value,
        t: this.t,
        vue,
        category: editCategory.value ? editCategory.value : { icon: "fa fa-folder", name: "", type: "folders", color: "", folders: [] },
        categoryKey: editKey.value,
        onClose: () => close(),
        "onUpdate:category": (category) => saveCategory(category),
        "onUpdate:delete": (key) => deleteCategory(key)
      }),
      h(Field, { label: this.t('modules.kiosk.options.add') }, [
        h(Button, {
          theme: "primary",
          icon: "fa fa-plus",
          onClick: () => {
            editCategory.value = null;
            editKey.value = undefined;
            isFormOpen.value = true;
          }
        }, this.t('modules.kiosk.options.add_category'))
      ]),
    ];
  }
}
