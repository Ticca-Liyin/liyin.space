import { ref } from 'vue'
import { defineStore } from 'pinia'
import { authorInfoVersion } from '@/utils/version.js'

export const useAuthorStore = defineStore('author', () => {
    
    const authors = ref({})

    const initialAuthorsInfo = () => {
        fetch(`/src/jsons/AuthorInfo.json?v=${authorInfoVersion}`).then(response => response.json())
        .then(authorInfo => {
            authors.value = authorInfo
            // console.log(authorInfo)
        })
        .catch(error => console.error(error))
    }

    return {  
        authors,
        initialAuthorsInfo
    }
})