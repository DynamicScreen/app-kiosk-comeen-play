import {defineComponent, h, PropType} from "vue";
import {CategoryWithId} from "../Kiosk";
import SideBar from "./SideBar";
import FoldersList from "./FoldersList";

const HOME = "Home"

export default defineComponent({
    props: {
        categories: {type: Array as PropType<CategoryWithId[]>, required: true},
        selectedCategoryId: {type: Number, required: true}
    },
    emits: ["closeCategory", "openCategory"],
    setup(props, {emit}) {
        const {computed} = window.kiosk.vue;

        const category = computed(() => {
            return props.categories.find((category) => category.uid === props.selectedCategoryId);
        })

        return () => h("div", {
                class: "w-full h-full flex flex-row"
            }, [
                h(SideBar, {
                    onOpenCategory: (category) => {console.log("EMIT ECATEGORY"); emit("openCategory", category)},
                    onCloseCategory: () => emit("closeCategory"),
                    categories: props.categories,
                    selectedCategoryId: props.selectedCategoryId
                }),
                h(FoldersList, {
                    category: category.value ?? props.categories[0]
                })
            ]
        )
    }
});