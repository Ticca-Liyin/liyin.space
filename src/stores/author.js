import { ref } from 'vue'
import { defineStore } from 'pinia'
import { authorInfoVersion } from '@/utils/version.js'

export const useAuthorStore = defineStore('author', () => {
    
    const authors = ref({})

    const initialAuthorsInfo = async () => {
        return fetch(`/src/jsons/AuthorInfo.json?v=${authorInfoVersion}`).then(response => response.json())
        .then(authorInfo => {
            authors.value = authorInfo
            
            return authorInfo
        })
        .catch(error => {
            console.error(error)
            throw error
        })
    }

    return {  
        authors,
        initialAuthorsInfo
    }
})