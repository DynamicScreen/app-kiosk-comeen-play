import {defineComponent, h, PropType} from "vue";
import {CategoryWithId} from "../Kiosk";
import NameIcon from "./NameIcon";
import Card from "./Card";

export type Folder = {
    name: string
    medias: []
}

export default defineComponent({
    props: {
        category: {type: Object as PropType<CategoryWithId>, required: true}
    },
    emits: ["openFolder"],
    setup(props, {emit}) {
        const {computed} = window.kiosk.vue;
        const {t} = window.kiosk;

        const renderFolder = (folder: Folder) => {
            return h(Card, {
                onClick: () => emit("openFolder", folder),
                name: folder.name,
                numberOfFiles: folder.medias.length
            })
        }

        const folders = computed(() => {
            return props.category.folders ?? props.category.links ?? [];
        })

        return () => h("div", {
            class: "w-full h-full flex pt-12 space-y-6"
        }, [
            h("div", {
                class: "flex flex-col w-full space-y-8"
            }, [
                h("span", {
                    class: "font-semibold text-3xl text-gray-700"
                }, t('modules.kiosk.options.view.select_folder')),
                h("div", {
                    class: "w-full h-3/5 flex flex-row space-x-10 flex-wrap"
                }, [
                    folders.value.map((folder) => renderFolder(folder))
                ])
            ]),
        ])
    }
});