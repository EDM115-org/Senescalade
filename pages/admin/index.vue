<script setup>
import { onMounted } from "vue"

const router = useRouter()

onMounted(() => {
  router.push("/admin/dashboard")
})
</script>
