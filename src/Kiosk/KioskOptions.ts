import {
  ISlideOptionsContext,
  SlideOptionsModule, VueInstance
} from "@comeen/comeen-play-sdk-js";
import CategoryForm from "./components/CategoryForm";
import {colorClasses} from "./utils/_Colors";

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
    const { h, ref, computed, toRefs, watch } = vue;
    const update = context.update;

    const isFormOpen = ref<boolean>(false);
    const categories = ref(update.option('categories').modelValue ?? []);

    //watch() catégorie update.option('categories'){onupdateOptions}

    const { Field, TextInput, MediaPicker, NumberInput, Button } = this.context.components;

    const saveCategory = (emitValue: {category: Category, key: number | undefined}) => {
        console.log("KEY KEY", emitValue.key, categories.value)
        if (emitValue.key) {
            categories.value[emitValue.key] = emitValue.category;
        } else categories.value.push(emitValue.category);
    }

    const renderCategory = (category: Category, key: number) => {
        return h("div", {
            class: "h-10 w-auto pl-3 width flex justify-between rounded border-2 transition hover:-translate-y-1 duration-300 hover:cursor-pointer items-center " + `text-${colorClasses[category.color]} border-${colorClasses[category.color]}`
        }, [
            h("div", {
                class: "space-x-3 flex flex-row items-center"
            }, [
                h("i", {class: category.icon}),
                h("span", {
                    class: ""
                }, category.name)
            ]),
            h("button", {
                class: `w-8 z-10 h-full hover:scale-x-110 transition bg-${colorClasses[category.color]}`
            }, [
                h("i", {
                    class: "fa fa-xmark text-sm text-white"
                })
            ])
        ])
    }

    watch(() => categories, (newValue) => {
        update.option('categories')["onUpdate:modelValue"](newValue);
    }, {deep: true})

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
        !isFormOpen.value && h(Field, { label: this.t('modules.kiosk.options.add') }, [
            h(Button, {
                theme: "primary",
                icon: "fa fa-plus",
                onClick: () => { isFormOpen.value = true; }
            }, this.t('modules.kiosk.options.add_category'))
        ]),
        h(CategoryForm, {
            formComponents: this.context.components,
            open: isFormOpen.value,
            t: this.t,
            vue,
            "onUpdate:category": (category) => saveCategory(category)
        }),
        h("div", {
            class: "flex grid grid-cols-2 gap-4 justify-between w-full"
        }, [
            categories.value.length > 0 ?
                categories.value.map((category, key) => renderCategory(category, key))
                :
                h("span", {class: "font-light text-gray-400"}, this.t("modules.kiosk.options.no_categories"))
        ]),
        h(Field, { label: this.t('modules.kiosk.options.background_image') }, [
            h(MediaPicker, { type: 'image', ...update.option("background_img") }),
            h("span", {
                class: "text-xs text-gray-400"
            }, this.t('modules.kiosk.options.background_warning'))
        ])
    ];
  }
}
