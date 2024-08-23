<template lang="">
    <div>
        <DataTable v-model:selection="selectedCompetidor" :value="competidores" paginator showGridlines :rows="5"
            :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem">
            <Column field="id" header="id" sortable></Column>
            <Column field="links" header="id" sortable></Column>

            <Column header="Competidores" sortable>
                <template #body="slotProps">
                    <span class="p-buttonset">
                        <Button label="Ver" icon="pi pi-eye" @click="verCompetidores(slotProps.data)" />
                    </span>
                </template>
            </Column>
        </DataTable>
    </div>
</template>
<script>
export default {
    data() {
        return {
            selectedCompetidor: null,
        }
    },
    props: {
        competidores: {
            type: Array,
            required: true,
        },
    },
}
</script>
<style lang="">
    
</style>