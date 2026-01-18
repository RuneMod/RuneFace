$currentFolder = Get-Location
$glbFolder = $currentFolder.Path
$fbxFolder = Join-Path -Path $currentFolder.Path -ChildPath "fbx"
$blenderPath = "C:\Program Files\Blender Foundation\Blender 4.0\blender.exe"

# Create fbx directory if it doesn't exist
if (-not (Test-Path -Path $fbxFolder)) {
    New-Item -ItemType Directory -Path $fbxFolder
}

function Convert-GLBtoFBX {
    param (
        [string]$glbFile,
        [string]$fbxFile
    )
    & $blenderPath --background --python-expr "import bpy; bpy.ops.object.select_all(action='DESELECT'); bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(); bpy.ops.import_scene.gltf(filepath='$($glbFile -replace '\\', '\\\\')'); bpy.ops.export_scene.fbx(filepath='$($fbxFile -replace '\\', '\\\\')'); bpy.ops.wm.quit_blender()"


[System.Media.SystemSounds]::Asterisk.Play()
}

function Convert-FBXtoGLB {
    param (
        [string]$fbxFile,
        [string]$glbFile
    )
    & $blenderPath --background --python-expr "import bpy; bpy.ops.object.select_all(action='DESELECT'); bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(); bpy.ops.import_scene.fbx(filepath='$($fbxFile -replace '\\', '\\\\')'); bpy.ops.export_scene.gltf(filepath='$($glbFile -replace '\\', '\\\\')'); bpy.ops.wm.quit_blender()"

[System.Media.SystemSounds]::Asterisk.Play()
}

while ($true) {
    Get-ChildItem -Path $glbFolder -Filter *.glb | ForEach-Object {
        $fbxFile = Join-Path -Path $fbxFolder -ChildPath ($_.BaseName + ".fbx")
        if (-not (Test-Path $fbxFile)) {
            Convert-GLBtoFBX -glbFile $_.FullName -fbxFile $fbxFile
        }
    }

    Get-ChildItem -Path $fbxFolder -Filter *.fbx | ForEach-Object {
        $glbFile = Join-Path -Path $glbFolder -ChildPath ($_.BaseName + ".glb")
        if (-not (Test-Path $glbFile) -or ($_.LastWriteTime -gt (Get-Item $glbFile).LastWriteTime)) {
            Convert-FBXtoGLB -fbxFile $_.FullName -glbFile $glbFile
        }
    }

    Start-Sleep -Seconds 5
}