import {computed, defineComponent, h, PropType} from "vue";
import {CategoryWithId} from "../Kiosk";
import SideBar from "./SideBar";
import FoldersList from "./FoldersList";

const HOME = "Home"

export default defineComponent({
    props: {
        categories: {type: Array as PropType<CategoryWithId[]>, required: true},
        selectedCategoryId: {type: Number, required: true}
    },
    setup(props) {
        const category = computed(() => {
            return props.categories.find((category) => category.uid === props.selectedCategoryId);
        })

        return () => h("div", {
                class: "w-full h-full"
            }, [
                // h(SideBar, {
                //     categories: props.categories,
                //     selectedCategoryId: props.selectedCategoryId
                // }),
                h(FoldersList, {
                    category: category.value ?? props.categories[0]
                })
            ]
        )
    }
});