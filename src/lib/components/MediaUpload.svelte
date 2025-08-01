<script>
  import { onMount } from 'svelte';
  import { Camera, Upload, Video, Mic, X, CheckCircle, AlertCircle } from 'lucide-svelte';
  
  let { 
    images = $bindable([]),
    videos = $bindable([]),
    audio = $bindable([]),
    onMediaUpload
  } = $props();
  
  let isRecording = $state(false);
  let mediaStream = $state(null);
  let mediaRecorder = $state(null);
  let videoElement = $state(null);
  let captureMode = $state('photo'); // 'photo', 'video', 'audio'
  let recordingTime = $state(0);
  let uploadProgress = $state({});
  
  let recordingInterval;
  
  const maxFileSize = 50 * 1024 * 1024; // 50MB
  const supportedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const supportedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
  const supportedAudioTypes = ['audio/mp3', 'audio/wav', 'audio/m4a', 'audio/webm'];
  
  onMount(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  });
  
  async function startCamera() {
    try {
      const constraints = {
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Back camera on mobile
        },
        audio: captureMode === 'video'
      };
      
      mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoElement) {
        videoElement.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      alert('Camera access required for photo/video capture. Please enable camera permissions.');
    }
  }
  
  async function startAudioRecording() {
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(mediaStream);
      
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const file = new File([blob], `audio-${Date.now()}.webm`, { type: 'audio/webm' });
        addAudioFile(file);
      };
      
      mediaRecorder.start();
      isRecording = true;
      recordingTime = 0;
      
      recordingInterval = setInterval(() => {
        recordingTime += 1;
      }, 1000);
      
    } catch (error) {
      console.error('Microphone access denied:', error);
      alert('Microphone access required for audio recording. Please enable microphone permissions.');
    }
  }
  
  function stopAudioRecording() {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      isRecording = false;
      clearInterval(recordingInterval);
      
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
      }
    }
  }
  
  function capturePhoto() {
    if (!mediaStream) return;
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    
    context.drawImage(videoElement, 0, 0);
    
    canvas.toBlob((blob) => {
      const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
      addImageFile(file);
    }, 'image/jpeg', 0.8);
  }
  
  async function startVideoRecording() {
    if (!mediaStream) return;
    
    try {
      mediaRecorder = new MediaRecorder(mediaStream);
      const chunks = [];
      
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const file = new File([blob], `video-${Date.now()}.webm`, { type: 'video/webm' });
        addVideoFile(file);
      };
      
      mediaRecorder.start();
      isRecording = true;
      recordingTime = 0;
      
      recordingInterval = setInterval(() => {
        recordingTime += 1;
      }, 1000);
      
    } catch (error) {
      console.error('Video recording failed:', error);
    }
  }
  
  function stopVideoRecording() {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      isRecording = false;
      clearInterval(recordingInterval);
    }
  }
  
  function handleFileUpload(event) {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      if (file.size > maxFileSize) {
        alert(`File ${file.name} is too large. Maximum size is 50MB.`);
        return;
      }
      
      if (supportedImageTypes.includes(file.type)) {
        addImageFile(file);
      } else if (supportedVideoTypes.includes(file.type)) {
        addVideoFile(file);
      } else if (supportedAudioTypes.includes(file.type)) {
        addAudioFile(file);
      } else {
        alert(`File type ${file.type} is not supported.`);
      }
    });
    
    // Clear input
    event.target.value = '';
  }
  
  function addImageFile(file) {
    const fileInfo = {
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
      type: 'image'
    };
    
    images = [...images, fileInfo];
    onMediaUpload?.({ images, videos, audio });
    simulateUpload(fileInfo.id);
  }
  
  function addVideoFile(file) {
    const fileInfo = {
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
      type: 'video'
    };
    
    videos = [...videos, fileInfo];
    onMediaUpload?.({ images, videos, audio });
    simulateUpload(fileInfo.id);
  }
  
  function addAudioFile(file) {
    const fileInfo = {
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: 'audio'
    };
    
    audio = [...audio, fileInfo];
    onMediaUpload?.({ images, videos, audio });
    simulateUpload(fileInfo.id);
  }
  
  function simulateUpload(fileId) {
    uploadProgress[fileId] = 0;
    
    const interval = setInterval(() => {
      uploadProgress[fileId] += Math.random() * 30;
      
      if (uploadProgress[fileId] >= 100) {
        uploadProgress[fileId] = 100;
        clearInterval(interval);
      }
    }, 200);
  }
  
  function removeFile(fileId, type) {
    if (type === 'image') {
      images = images.filter(img => img.id !== fileId);
    } else if (type === 'video') {
      videos = videos.filter(vid => vid.id !== fileId);
    } else if (type === 'audio') {
      audio = audio.filter(aud => aud.id !== fileId);
    }
    
    delete uploadProgress[fileId];
    onMediaUpload?.({ images, videos, audio });
  }
  
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
</script>

<div class="space-y-6">
  <!-- Capture Mode Selection -->
  <div class="flex gap-4 justify-center">
    <button
      class="flex items-center gap-2 px-4 py-2 rounded-lg {captureMode === 'photo' ? 'bg-trust-100 text-trust-700 border-trust-300' : 'bg-gray-100 text-gray-600'} border transition-all duration-200"
      onclick={() => captureMode = 'photo'}
    >
      <Camera size={18} />
      Photo
    </button>
    
    <button
      class="flex items-center gap-2 px-4 py-2 rounded-lg {captureMode === 'video' ? 'bg-trust-100 text-trust-700 border-trust-300' : 'bg-gray-100 text-gray-600'} border transition-all duration-200"
      onclick={() => captureMode = 'video'}
    >
      <Video size={18} />
      Video
    </button>
    
    <button
      class="flex items-center gap-2 px-4 py-2 rounded-lg {captureMode === 'audio' ? 'bg-trust-100 text-trust-700 border-trust-300' : 'bg-gray-100 text-gray-600'} border transition-all duration-200"
      onclick={() => captureMode = 'audio'}
    >
      <Mic size={18} />
      Audio
    </button>
  </div>
  
  <!-- Camera/Recording Interface -->
  {#if captureMode === 'photo' || captureMode === 'video'}
    <div class="bg-black rounded-lg overflow-hidden relative">
      {#if mediaStream}
        <video
          bind:this={videoElement}
          autoplay
          muted
          playsinline
          class="w-full h-64 md:h-96 object-cover"
        ></video>
        
        <!-- Recording Indicator -->
        {#if isRecording && captureMode === 'video'}
          <div class="absolute top-4 left-4 flex items-center gap-2 bg-scarcity-600 text-white px-3 py-1 rounded-full">
            <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            REC {formatTime(recordingTime)}
          </div>
        {/if}
        
        <!-- Capture Controls -->
        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
          {#if captureMode === 'photo'}
            <button
              class="w-16 h-16 bg-white rounded-full border-4 border-gray-300 hover:border-trust-400 transition-all duration-200 flex items-center justify-center"
              onclick={capturePhoto}
            >
              <Camera size={24} class="text-gray-700" />
            </button>
          {:else if captureMode === 'video'}
            <button
              class="w-16 h-16 {isRecording ? 'bg-scarcity-600' : 'bg-white'} rounded-full border-4 border-gray-300 hover:border-trust-400 transition-all duration-200 flex items-center justify-center"
              onclick={isRecording ? stopVideoRecording : startVideoRecording}
            >
              {#if isRecording}
                <div class="w-6 h-6 bg-white rounded-sm"></div>
              {:else}
                <Video size={24} class="text-gray-700" />
              {/if}
            </button>
          {/if}
        </div>
      {:else}
        <div class="h-64 md:h-96 flex items-center justify-center bg-gray-100">
          <button
            class="btn-primary flex items-center gap-2"
            onclick={startCamera}
          >
            <Camera size={20} />
            Start Camera
          </button>
        </div>
      {/if}
    </div>
  
  {:else if captureMode === 'audio'}
    <div class="bg-gray-100 rounded-lg p-8 text-center">
      {#if isRecording}
        <div class="space-y-4">
          <div class="w-16 h-16 bg-scarcity-600 rounded-full mx-auto flex items-center justify-center animate-pulse">
            <Mic size={24} class="text-white" />
          </div>
          <div class="text-lg font-semibold text-scarcity-600">
            Recording... {formatTime(recordingTime)}
          </div>
          <button
            class="btn-secondary"
            onclick={stopAudioRecording}
          >
            Stop Recording
          </button>
        </div>
      {:else}
        <div class="space-y-4">
          <div class="w-16 h-16 bg-trust-100 rounded-full mx-auto flex items-center justify-center">
            <Mic size={24} class="text-trust-600" />
          </div>
          <div class="text-lg font-semibold text-gray-700">
            Record Audio Description
          </div>
          <p class="text-gray-600">
            Describe the sounds, error messages, or explain the problem verbally
          </p>
          <button
            class="btn-primary flex items-center gap-2 mx-auto"
            onclick={startAudioRecording}
          >
            <Mic size={20} />
            Start Recording
          </button>
        </div>
      {/if}
    </div>
  {/if}
  
  <!-- File Upload Alternative -->
  <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-trust-400 transition-colors duration-200">
    <Upload size={48} class="mx-auto text-gray-400 mb-4" />
    <h3 class="text-lg font-semibold text-gray-700 mb-2">
      Or upload existing files
    </h3>
    <p class="text-gray-600 mb-4">
      Images, videos, or audio files up to 50MB
    </p>
    <input
      type="file"
      multiple
      accept="image/*,video/*,audio/*"
      onchange={handleFileUpload}
      class="hidden"
      id="file-upload"
    />
    <label for="file-upload" class="btn-secondary cursor-pointer inline-block">
      Choose Files
    </label>
  </div>
  
  <!-- Uploaded Files Display -->
  {#if images.length > 0 || videos.length > 0 || audio.length > 0}
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-900">Uploaded Files</h3>
      
      <!-- Images -->
      {#if images.length > 0}
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          {#each images as image}
            <div class="relative group">
              <img 
                src={image.preview} 
                alt="Uploaded" 
                class="w-full h-24 object-cover rounded-lg border border-gray-200"
              />
              <button
                class="absolute -top-2 -right-2 w-6 h-6 bg-scarcity-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onclick={() => removeFile(image.id, 'image')}
              >
                <X size={12} />
              </button>
              
              <!-- Upload Progress -->
              {#if uploadProgress[image.id] !== undefined && uploadProgress[image.id] < 100}
                <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
                  {Math.round(uploadProgress[image.id])}%
                </div>
              {/if}
            </div>
          {/each}
        </div>
      {/if}
      
      <!-- Videos -->
      {#if videos.length > 0}
        <div class="space-y-2">
          {#each videos as video}
            <div class="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div class="flex items-center gap-3">
                <Video size={20} class="text-trust-600" />
                <div>
                  <div class="font-medium text-gray-900">{video.name}</div>
                  <div class="text-sm text-gray-600">{formatFileSize(video.size)}</div>
                </div>
              </div>
              
              <div class="flex items-center gap-2">
                {#if uploadProgress[video.id] === 100}
                  <CheckCircle size={20} class="text-success-600" />
                {:else if uploadProgress[video.id] !== undefined}
                  <div class="text-sm text-trust-600">{Math.round(uploadProgress[video.id])}%</div>
                {/if}
                
                <button
                  class="text-scarcity-600 hover:text-scarcity-700"
                  onclick={() => removeFile(video.id, 'video')}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          {/each}
        </div>
      {/if}
      
      <!-- Audio -->
      {#if audio.length > 0}
        <div class="space-y-2">
          {#each audio as audioFile}
            <div class="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div class="flex items-center gap-3">
                <Mic size={20} class="text-trust-600" />
                <div>
                  <div class="font-medium text-gray-900">{audioFile.name}</div>
                  <div class="text-sm text-gray-600">{formatFileSize(audioFile.size)}</div>
                </div>
              </div>
              
              <div class="flex items-center gap-2">
                {#if uploadProgress[audioFile.id] === 100}
                  <CheckCircle size={20} class="text-success-600" />
                {:else if uploadProgress[audioFile.id] !== undefined}
                  <div class="text-sm text-trust-600">{Math.round(uploadProgress[audioFile.id])}%</div>
                {/if}
                
                <button
                  class="text-scarcity-600 hover:text-scarcity-700"
                  onclick={() => removeFile(audioFile.id, 'audio')}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
  
  <!-- Tips for Better Diagnosis -->
  <div class="bg-trust-50 border border-trust-200 rounded-lg p-4">
    <h4 class="font-semibold text-trust-800 mb-2">Tips for Better Diagnosis</h4>
    <ul class="text-sm text-trust-700 space-y-1">
      <li>• Take clear, well-lit photos of the problem area</li>
      <li>• Record any unusual sounds or error messages</li>
      <li>• Show multiple angles of the equipment</li>
      <li>• Include serial numbers or model labels if visible</li>
    </ul>
  </div>
</div>