import {
  ISlideOptionsContext,
  SlideOptionsModule, VueInstance
} from "@comeen/comeen-play-sdk-js";
import {h} from "vue";

export type Category = {
    icon: string
    name: string
    type: string
    color: string
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
    const { h, ref, computed } = vue;
    const update = context.update;

    const isFormOpen = ref<boolean>(false);
    const categories = ref(update.option('categories'));

    const icon = ref<string>("");
    const type = ref<string>("");
    const categoryName = ref<string>("");

      const { Field, TextInput, MediaPicker, NumberInput,
          FolderPicker, Button, ColorPicker, Select, IconPicker } = this.context.components

      const linkForm = () => {
          return [h("div", {
              class: "flex flex-row"
          }, [
              h(IconPicker),
              h(Field, {label: this.t("modules.kiosk.options.form.name")}, [
                  h(TextInput, {
                      placeholder: this.t("modules.kiosk.options.form.link_name")
                  })
              ])
          ]),
              h(Field, {label: this.t("modules.kiosk.options.form.secure_url")}, [
                  h(TextInput, {
                      placeholder: "https://"
                  })
              ]),
              h(Button, {
                  theme: "primary",
                  icon: "fa fa-plus"
              })]
      }

      const categoryForm = (category: Category | null = null) => {
          return h("div", {
              class: (isFormOpen.value ? "h-fit opacity-100" : "h-0 opacity-0") +
                  " transition-all duration-200 space-y-3 border border-gray-700 p-5",
          }, [
              h(Field, {
                  label: this.t('modules.kiosk.options.form.icon'),
                  class: "w-1/6"
              }, [
                  h(IconPicker),
              ]),
              h(Field, {
                  label: this.t('modules.kiosk.options.form.type'),
                  class: "w-2/5"
              }, [
                  h(Select, {
                      options: [
                          { id: "folders", name: this.t("modules.kiosk.options.form.files") },
                          { id: "links", name: this.t("modules.kiosk.options.form.websites") }
                      ],
                  }),
              ]),
              h(Field, {
                  label: this.t('modules.kiosk.options.form.category'),
                  class: "w-2/4"
              }, [
                  h(TextInput, {
                      placeholder: this.t('modules.kiosk.options.form.category_name_placeholder')
                  }),
              ]),
              h(Field, {
                  label: this.t('modules.kiosk.options.form.color'),
              }, [
                  h(ColorPicker)
              ]),
              h(Field, {
                  label: this.t('modules.kiosk.options.form.folder_to_display')
              },
                  ...update.option("type") && type.value === "folders" ?
                      [
                          h(FolderPicker),
                          h("span", {
                              class: "text-xs text-gray-400"
                          }, this.t('modules.kiosk.options.form.multiple_select'))
                      ] :
                      linkForm()
              )
          ])
      }

    const submitCategories = (category: Category) => {

    }

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
            }, [
                h("span", {
                    class: "text-white"
                }, this.t('modules.kiosk.options.add_category'))
            ])
        ]),
        categoryForm(),
        h(Field), { label: this.t('modules.kiosk.options.background_image') }, [
            h(MediaPicker, { type: 'image', ...update.option("background_img") }),
            h("span", {
                class: "text-xs text-gray-400"
            }, this.t('modules.kiosk.options.background_warning'))
        ]
    ];
  }
}
