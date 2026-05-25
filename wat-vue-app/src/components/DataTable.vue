<!-- components/DataTable.vue-->
<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
data: { type: Array, required: true },
columns: { type: Array, required: true },
perPage: { type: Number, default: 10 }
});

const search= ref('');
const sortKey= ref('');
const sortAsc = ref(true);
const currentPage = ref(1);

watch(search, () => { currentPage.value = 1; });

const filtered = computed(() => {
    if (!search.value) return props.data;
        const q = search.value.toLowerCase();
        return props.data.filter(row =>
        Object.values(row).some(v => String(v).toLowerCase().includes(q
        ))
    );
});

const sorted = computed(() => {
    if (!sortKey.value) return filtered.value;
    return [...filtered.value].sort((a, b) => {
    const va = a[sortKey.value], vb = b[sortKey.value];
    return sortAsc.value ? (va > vb ? 1 :-1) : (va < vb ? 1 :-1);
    });
});

const paginated = computed(() => {
    const start = (currentPage.value- 1) * props.perPage;
    return sorted.value.slice(start, start + props.perPage);
});

const totalPages = computed(() => Math.ceil(filtered.value.length /
props.perPage));

function sortBy(key) {
    if (sortKey.value === key) sortAsc.value = !sortAsc.value;
    else { sortKey.value = key; sortAsc.value = true; }
}
</script>
<template>
    <div class="data-table-wrapper">
        <input v-model="search" placeholder="Szukaj..." class="search-input" />
        <table class="data-table">
            <thead>
                <tr>
                    <th v-for="col in columns" :key="col.key" @click="sortBy(col.key)">
                        {{ col.label }}
                        <span v-if="sortKey === col.key">{{ sortAsc ? ' ' : '' }}</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in paginated" :key="row.id">
                    <td v-for="col in columns" :key="col.key">{{ row[col.key]}}</td>
                </tr>
                <tr v-if="paginated.length === 0">
                    <td :colspan="columns.length" class="empty">Brak wynikow</td>
                </tr>
            </tbody>
        </table>
        <div class="pagination">
            <button @click="currentPage--" :disabled="currentPage <= 1">&#8592;</button>
            <span>Strona {{ currentPage }} / {{ totalPages }}</span>
            <button @click="currentPage++" :disabled="currentPage >=totalPages">&#8594;</button>
        </div>
    </div>
</template>