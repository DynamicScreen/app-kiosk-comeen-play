import {ComputedRef, defineComponent, h, PropType} from "vue";
import {IComponentsList, VueInstance} from "@comeen/comeen-play-sdk-js";
import {Category, Link} from "../KioskOptions";

export default defineComponent({
    props: {
        formComponents: {type: Object as PropType<IComponentsList>, required: true},
        open: {type: Boolean, required: true},
        t: {type: Function, required: true},
        category: {type: Object as PropType<Category>, default: {icon: "fa fa-folder", name: "",type: "folders", color: ""}},
        vue: {type: Object as PropType<VueInstance>, required: true},
        key: {type: Number, required: false}
    },
    name: "CategoryForm",
    emits: ["update:category"],
    setup(props, {emit}) {
        const { ref, toRef, toRefs, computed } = props.vue;

        const icon = ref(props.category.icon);
        const name = ref(props.category.name);
        const type = ref(props.category.type);
        const color = ref(props.category.color);
        const links = ref(props.category?.links ?? []);
        const folders = ref(props.category?.folders ?? []);

        const category = computed(() => {
            return {
                icon: icon.value,
                name: name.value,
                type: type.value,
                color: color.value,
            }
        });

        const isButtonDisabled = computed(() => {
            return !icon.value || !name.value || !type.value || !color.value || (links.value.length === 0 && folders.value.length === 0);
        })

        const linkName = ref("");
        const linkIcon = ref("fa fa-display");
        const linkUrl = ref("");

        const saveCategory = () => {
            let categoryToSave = category.value;
            if (type.value === "links") {
                categoryToSave["links"] = links.value;
                delete categoryToSave["folders"];
            }
            if (type.value === "folders") {
                categoryToSave["folders"] = folders.value;
                delete categoryToSave["links"];
            }

            emit("update:category", {
                category: categoryToSave,
                key: props.key
            });
        }

        const addLink = () => {
            const urlToAdd = {
                name: linkName.value,
                icon: linkIcon.value,
                url: linkUrl.value
            }
            links.value.push(urlToAdd);

            linkName.value = ""
            linkIcon.value = "fa fa-display"
            linkUrl.value = ""
        }

        const removeLink = (linkToDelete: Link) => {
            links.value = links.value.filter((link) => link !== linkToDelete);
        }

        const folderForm = () => {
            return [
                h(props.formComponents.Field, {
                    label: props.t('modules.kiosk.options.form.folder_to_display')
                }, [
                    h(props.formComponents.FolderPicker, {
                        modelValue: folders.value,
                        'onUpdate:modelValue': (value) => folders.value = value
                    }),
                    h("span", {
                        class: "text-xs text-gray-400"
                    }, props.t('modules.kiosk.options.form.multiple_select'))
                ])
            ]
        }

        const linkForm = () => {
            return [
                h("div", {
                class: "flex flex-row space-x-3"
            }, [
                h(props.formComponents.Field, {
                    label: props.t("modules.kiosk.options.form.icon"),
                    class: "w-1/4"
                }, [
                    h(props.formComponents.IconPicker, {
                        modelValue: linkIcon.value,
                        'onUpdate:modelValue': (value) => linkIcon.value = value
                    }),
                ]),
                h(props.formComponents.Field, {
                    label: props.t("modules.kiosk.options.form.name"),
                    class: "w-full"
                }, [
                    h(props.formComponents.TextInput, {
                        placeholder: props.t("modules.kiosk.options.form.link_name"),
                        modelValue: linkName.value,
                        'onUpdate:modelValue': (value) => linkName.value = value
                    })
                ])
            ]),
                h(props.formComponents.Field, {label: props.t("modules.kiosk.options.form.secure_url")}, [
                    h(props.formComponents.TextInput, {
                        placeholder: "https://",
                        modelValue: linkUrl.value,
                        'onUpdate:modelValue': (value) => linkUrl.value = value
                    })
                ]),
                h(props.formComponents.Button, {
                    class: "mt-3",
                    theme: "primary",
                    icon: "fa fa-plus",
                    onClick: () => addLink()
                }, props.t("modules.kiosk.options.form.add_link")),
                links.value.length > 0 && links.value.map((link: Link) => displayLink(link))
            ]
        }

        const displayLink = (link: Link) => {
            return h("div", {
                class: "w-full mt-2 bg-white h-10 rounded border border-gray-300 flex flex-row justify-between items-center space-x-2 px-2"
            }, [
                h("div", {
                    class: "flex flex-row items-center space-x-2 pl-2"
                }, [
                    h("i", {
                        class: link.icon + " text-primary"
                    }),
                    h("span", {
                        class: "font-semibold text-sm"
                    }, link.name),
                    h("span", {
                        class: "text-gray-400 text-sm"
                    }, " - "),
                    h("span", {
                        class: "text-gray-400 text-sm"
                    }, link.url),
                ]),
                h("button", {
                    class: "rounded-full w-6 h-6 bg-red-500 flex items-center justify-center",
                    onClick: () => removeLink(link)
                }, [
                    h("i", {
                        class: "fa fa-xmark text-white"
                    })
                ])
            ])
        }

        return () => h(
            "div", {
                class: (props.open ? "h-fit opacity-100 space-y-3 border border-gray-600 p-5 bg-gray-50 rounded" : "h-0 opacity-0 invisible") +
                    " transition-opacity duration-300",
            }, [
                h(props.formComponents.Field, {
                    label: props.t('modules.kiosk.options.form.icon'),
                    class: "w-1/6"
                }, [
                    h(props.formComponents.IconPicker, {
                        modelValue: icon.value,
                        'onUpdate:modelValue': (value) => icon.value = value
                    }),
                ]),
                h(props.formComponents.Field, {
                    label: props.t('modules.kiosk.options.form.type'),
                    class: "w-2/5"
                }, [
                    h(props.formComponents.Select, {
                        options: [
                            { id: "folders", name: props.t("modules.kiosk.options.form.files") },
                            { id: "links", name: props.t("modules.kiosk.options.form.websites") }
                        ],
                        modelValue: type.value,
                        'onUpdate:modelValue': (value) => type.value = value
                    }),
                ]),
                h(props.formComponents.Field, {
                    label: props.t('modules.kiosk.options.form.category'),
                    class: "w-2/4"
                }, [
                    h(props.formComponents.TextInput, {
                        placeholder: props.t('modules.kiosk.options.form.category_name_placeholder'),
                        modelValue: name.value,
                        'onUpdate:modelValue': (value) => name.value = value
                    }),
                ]),
                h(props.formComponents.Field, {
                    label: props.t('modules.kiosk.options.form.color'),
                }, [
                    h(props.formComponents.ColorPicker, {
                        modelValue: color.value,
                        'onUpdate:modelValue': (value) => color.value = value
                    })
                ]),
                h("div", {
                        class: "py-2 space-y-3"
                    },
                    type.value === "folders" ? folderForm() : linkForm()
                ),
                h("div", {
                    class: "h-1 w-full bg-primary"
                }),
                h(props.formComponents.Button, {
                    theme: "primary",
                    icon: "fa fa-plus",
                    disabled: isButtonDisabled.value,
                    onClick: () => saveCategory()
                }, props.t('modules.kiosk.options.form.create'))
            ])

    }
})