import {computed, defineComponent, h, PropType, ref} from "vue";
import {CategoryWithId} from "../Kiosk";
import NameIcon from "./NameIcon";
import Card from "./Card";
import {Link} from "../KioskOptions";

const SELECT_FOLDER = "Select a folder";
export type Folder = {
    name: string
    medias: []
}

export default defineComponent({
    props: {
        category: {type: Object as PropType<CategoryWithId>, required: true}
    },
    setup(props) {
        const renderFolder = (folder: Link | Folder) => {
            return h(Card, {
                name: folder.name,
                numberOfFiles: folder.medias.length
            })
        }

        const folders = computed(() => {
            return props.category.folders ?? props.category.links ?? [];
        })

        return () => h("div", {
            class: "w-full h-full flex pl-8 space-y-6"
        }, [
            h("div", {
                class: "flex flex-col"
            }, [
                h(NameIcon, {
                    color: props.category.color,
                    name: props.category.name,
                    icon: props.category.icon,
                }),
                h("span", {
                    class: "font-semibold text-xl"
                }, SELECT_FOLDER),
                h("div", {
                    class: "w-full h-3/5 flex flex-row justify-around grid-rows-4"
                }, [
                    folders.value.map((folder) => renderFolder(folder))
                ])
            ]),
        ])
    }
});