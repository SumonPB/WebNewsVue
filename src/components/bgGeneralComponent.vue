<script>

</script>

<template>


</template>

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Poppins', sans-serif;
    background: linear-gradient(135deg, #f0f9ff 0%, #f9fafb 100%);
    color: var(--text-primary);
    min-height: 100vh;
    padding: 2rem;
    animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}