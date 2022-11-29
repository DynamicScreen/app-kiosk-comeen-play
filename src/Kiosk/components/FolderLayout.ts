import {defineComponent, h, PropType} from "vue";
import {CategoryWithId} from "../Kiosk";
import SideBar from "./SideBar";
import FoldersList from "./FoldersList";
import List from "./List";
import NameIcon from "./NameIcon";

const HOME = "Home"

export default defineComponent({
    props: {
        categories: {type: Array as PropType<CategoryWithId[]>, required: true},
        selectedCategoryId: {type: Number, required: true}
    },
    emits: ["closeCategory", "openCategory"],
    setup(props, {emit}) {
        const {computed, ref} = window.kiosk.vue;
        const {t} = window.kiosk;
        const displayFolderList = ref(true);
        const selectedFolder = ref(null);

        const gotoFolder = (folder) => {
            selectedFolder.value = folder;
            displayFolderList.value = false;
        }

        const goBack = () => {
            displayFolderList.value = true;
            selectedFolder.value = null;
        }

        const category = computed(() => {
            return props.categories.find((category) => category.uid === props.selectedCategoryId);
        })

        return () => h("div", {
                class: "w-full h-full flex flex-row"
            }, [
                h(SideBar, {
                    onOpenCategory: (category) => {
                        emit("openCategory", category);
                        goBack()
                    },
                    onCloseCategory: () => emit("closeCategory"),
                    categories: props.categories,
                    selectedCategoryId: props.selectedCategoryId
                }),
                h("div", {
                    class: "w-full h-full pl-8 pt-5"
                }, [
                    h(NameIcon, {
                        color: category.value.color,
                        name: category.value.name,
                        icon: category.value.icon,
                        iconStyle: `text-3xl text-${category.value.color}-500`,
                        textStyle: `text-2xl text-${category.value.color}-500 font-bold`
                    }),
                    displayFolderList.value ?
                        h(FoldersList, {
                            onOpenFolder: (folder) => gotoFolder(folder),
                            category: category.value ?? props.categories[0]
                        }) :
                        h(List, {
                            onCloseFolder: () => goBack(),
                            medias: selectedFolder.value?.medias ?? []
                        })
                ]),
            ]
        )
    }
});